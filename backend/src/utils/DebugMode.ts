
export class DebugMode {

    prefix: string | undefined;
    isEnabledString: string | undefined;
    isEnabled: boolean = false;

    constructor(DEBUG_MODE: string | undefined) {
        this.isEnabledString = process.env.DEBUG_MODE;
        this.prefix = process.env.DEBUG_PREFIX;

        if(this.isEnabledString && this.isEnabledString === "true") {
            this.isEnabled = true;
        }
    }

    log(str: string) {
        if(!this.isEnabled) {
            return;
        }
        console.log(this.prefix + " " + str);
    }
    warn(str: string) {
        if(!this.isEnabled) {
            return;
        }

        console.warn(this.prefix + " " + str);
    }
    error(str: string) {
        if(!this.isEnabled) {
            return;
        }

        console.error(this.prefix + " " + str);
    }
}

export const debugMode: DebugMode = new DebugMode(process.env.DEBUG_MODE);