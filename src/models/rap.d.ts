export namespace RapRef {
    export interface RapData {
        modelJSON?: ModelJSON;
        code?: number;
        msg?: number;
    }

    export interface ModelJSON {
        createDateStr?: Date;
        user?: User;
        id?: number;
        version?: string;
        introduction?: string;
        name?: string;
        moduleList?: EList[];
    }

    export interface EList {
        id?: number;
        introduction?: string;
        name?: string;
        pageList?: EList[];
        actionList?: ActionList[];
    }

    export interface ActionList {
        id?: number;
        name?: string;
        description?: string;
        requestType?: string;
        requestUrl?: string;
        responseTemplate?: string;
        requestParameterList?: ParameterList[];
        responseParameterList?: ParameterList[];
    }

    export interface ParameterList {
        id?: number;
        identifier?: string;
        name?: string;
        remark?: string;
        parameterList?: ParameterList[];
        validator?: string;
        dataType?: DataType;
    }

    export enum DataType {
        Array = "array",
        ArrayNumber = "array<number>",
        ArrayObject = "array<object>",
        ArrayString = "array<string>",
        Boolean = "boolean",
        Empty = "",
        Number = "number",
        Object = "object",
        String = "string"
    }

    export interface User {
        name?: string;
        id?: number;
    }
}
