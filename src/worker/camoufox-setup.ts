import extract from "extract-zip";
import fs from "fs";
import os from "os";
import path from "path";

export class CamoufoxSetup {
  private readonly downloadUrl: string;

  constructor() {
    this.downloadUrl = process.env.CAMOUFOX_DOWNLOAD_URL || "";
    if (!this.downloadUrl) {
      throw new Error("CAMOUFOX_DOWNLOAD_URL environment variable is not set");
    }
  }

  private getZipFileName(): string {
    const url = new URL(this.downloadUrl);
    const pathSegments = url.pathname.split("/");
    return pathSegments[pathSegments.length - 1] as string;
  }

  private async downloadFile(url: string, dest: string): Promise<void> {
    try {
      // Use fetch which properly handles redirects
      const response = await fetch(url, {
        redirect: "follow", // Automatically follow redirects
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download: ${response.status} ${response.statusText}`,
        );
      }

      // Get the response as a buffer
      const buffer = await response.arrayBuffer();

      // Write to file
      fs.writeFileSync(dest, Buffer.from(buffer));
    } catch (error) {
      // Clean up partial download if it exists
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      throw error;
    }
  }

  private async unzipFile(zipPath: string, extractDir: string): Promise<void> {
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }
    try {
      await extract(zipPath, { dir: extractDir });
    } catch (error) {
      throw new Error(`Failed to unzip file: ${error}`);
    }
  }

  async init(): Promise<string> {
    const zipFileName = this.getZipFileName();
    const zipFolderName = zipFileName.replace(".zip", "");
    const cacheDir = path.join(os.homedir(), "Library", "Caches");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const zipFolderPath = path.join(cacheDir, zipFolderName);

    const CAMOUFOX_PATH =
      zipFolderPath + "/Camoufox.app/Contents/MacOS/camoufox";

    if (fs.existsSync(CAMOUFOX_PATH)) {
      return CAMOUFOX_PATH;
    }

    if (!fs.existsSync(`${cacheDir}/${zipFileName}`)) {
      console.log("[browser] Downloading Camoufox...");
      await this.downloadFile(this.downloadUrl, `${cacheDir}/${zipFileName}`);
    }

    if (!fs.existsSync(CAMOUFOX_PATH)) {
      await this.unzipFile(`${cacheDir}/${zipFileName}`, zipFolderPath);
      fs.unlinkSync(`${cacheDir}/${zipFileName}`);
    }

    return CAMOUFOX_PATH;
  }
}
