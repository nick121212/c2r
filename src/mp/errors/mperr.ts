export class WMError extends Error {
    constructor(message: string, public code: string, public errData?: any) {
        super(message);
        this.name = "WMError";
    }
}
