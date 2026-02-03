/**
 * Storage management for browser profiles
 */

import { Page } from "playwright";
import { SupabaseClient } from "@supabase/supabase-js";
import { RoverFoxProfileData } from "./types";
import * as path from "path";
import * as fs from "fs";

const SAVE_STORAGE_EVERY_MS = 5000;

export class StorageManager {
  private scriptsCache: string | null = null;

  constructor(private supabaseClient: SupabaseClient) {}

  /**
   * Saves storage state to Supabase
   */
  async saveStorage(page: Page, profile: RoverFoxProfileData): Promise<void> {
    try {
      let { localStorage, indexedDB, origin }: any =
        await this.exportStorage(page);
      let cookies = await page.context().cookies();

      const { error } = await this.supabaseClient.rpc(
        "update_profile_storage_state",
        {
          p_browser_id: profile.browser_id,
          p_origin: origin,
          p_local_storage: localStorage,
          p_indexed_db: indexedDB,
          p_cookies: cookies,
        },
      );

      if (error) {
        // Silently ignore storage update errors
      }
    } catch (e) {}
  }

  /**
   * Initializes periodic storage saver
   */
  initStorageSaver(page: Page, profile: RoverFoxProfileData): void {
    let storageSaverInterval = setInterval(() => {
      this.saveStorage(page, profile);
    }, SAVE_STORAGE_EVERY_MS);

    page.once("close", () => {
      clearInterval(storageSaverInterval);
    });
  }

  /**
   * Sets fingerprinting properties on a page
   */
  async setFingerprintingProperties(
    page: Page,
    profile: RoverFoxProfileData,
  ): Promise<void> {
    await page.mainFrame().evaluate(
      ({
        fontSpacingSeed,
        audioFingerprintSeed,
        screenDimensions,
        geolocation,
        timezone,
      }: {
        fontSpacingSeed: number;
        audioFingerprintSeed: number | undefined;
        screenDimensions:
          | { width: number; height: number; colorDepth?: number }
          | undefined;
        geolocation: { lat: number; lon: number } | undefined;
        timezone: string | undefined;
      }) => {
        try {
          let _window = window as typeof window & {
            setFontSpacingSeed: (seed: number) => void;
            setAudioFingerprintSeed?: (seed: number) => void;
            setScreenDimensions?: (width: number, height: number) => void;
            setScreenColorDepth?: (depth: number) => void;
            setWebRTCIPv4: (ipv4: string) => void;
            setGeolocation?: (lat: number, lon: number) => void;
            setTimezone?: (timezone: string) => void;
          };
          _window.setFontSpacingSeed(fontSpacingSeed);

          // WebRTC IP disabled for now (patch is disabled in Camoufox)
          _window.setWebRTCIPv4("");

          if (audioFingerprintSeed && _window.setAudioFingerprintSeed) {
            _window.setAudioFingerprintSeed(audioFingerprintSeed);
          }

          if (screenDimensions && _window.setScreenDimensions) {
            _window.setScreenDimensions(
              screenDimensions.width,
              screenDimensions.height,
            );
            if (screenDimensions.colorDepth && _window.setScreenColorDepth) {
              _window.setScreenColorDepth(screenDimensions.colorDepth);
            }
          }

          if (geolocation && _window.setGeolocation) {
            _window.setGeolocation(geolocation.lat, geolocation.lon);
          }

          if (timezone && _window.setTimezone) {
            _window.setTimezone(timezone);
          }
        } catch (e) {}
      },
      {
        fontSpacingSeed: profile.data.fontSpacingSeed,
        audioFingerprintSeed: profile.data.audioFingerprintSeed,
        screenDimensions: profile.data.screenDimensions,
        geolocation: profile.data.geolocation,
        timezone: profile.data.timezone,
      },
    );
  }

  /**
   * Exports storage from a page
   */
  private async exportStorage(page: Page): Promise<any> {
    if (page.isClosed()) {
      return;
    }

    let { localStorage, indexedDB }: any = await page.evaluate(
      `(async () => {
        ${this.scripts()}
        return { localStorage: await exportLocalStorage(), indexedDB: await exportIndexedDB() }
      })()`,
    );

    let url = new URL(page.url());
    let origin = url.origin;
    return { localStorage, indexedDB, origin };
  }

  /**
   * Loads browser scripts for storage export
   */
  private scripts(): string {
    if (this.scriptsCache) {
      return this.scriptsCache;
    }
    const candidates = [
      path.join(__dirname, "../scripts"),
      path.join(__dirname, "../../scripts"),
      path.join(__dirname, "./scripts"),
    ];
    const scriptsDir = candidates.find((p) => fs.existsSync(p));
    if (!scriptsDir) {
      throw new Error(
        "Unable to locate scripts directory. Ensure src/scripts is copied to dist/scripts or available at runtime.",
      );
    }
    const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith(".js"));
    this.scriptsCache = files
      .map((f) => fs.readFileSync(path.join(scriptsDir, f), "utf-8"))
      .join("\n");
    return this.scriptsCache;
  }
}
