export declare class CamoufoxSetup {
    private readonly downloadUrl;
    constructor();
    private getZipFileName;
    private downloadFile;
    private unzipFile;
    init(): Promise<string>;
}
