import {JSONSchema6, JSONSchema6TypeName} from "json-schema";

/**
 * 获取基础的schema
 * @param {JSONSchema6TypeName}                 type schema类型
 * @returns {((title?: string) => JSONSchema6)}
 */
function getSchema(type: JSONSchema6TypeName): ((title?: string) => JSONSchema6) {
    return (title?: string): JSONSchema6 => {
        let schema: JSONSchema6 = {
            type,
            // title,
            description: title
        };

        return schema;
    };
}

/**
 * 处理数组的schema
 * @param {string} title
 * @param {*} itemSchema
 * @returns
 */
function getArraySchema(title: string, itemSchema: JSONSchema6): JSONSchema6 {
    let schema = getSchema("array")(title);

    if (itemSchema) {
        schema.items = itemSchema || {};
    }

    return schema;
}

/**
 * 根据type来生成schema
 * @param {string} dataType
 * @param {string} [title=""]
 * @param {Array<any>} [properties=[]]
 * @returns {*}
 */
function createDefaultSchema(dataType: string, title = "", properties: Array<any> = []): any {
    const types = dataType.match(/([A-Za-z]+)(!<){0,1}/g);

    if (!types) {
        return null;
    }

    switch (types[0]) {
        case "number":
        case "string":
        case "boolean":
        case "object":
            return getSchema(types[0] as any)(title);
        case "array":
            if (types[1]) {
                return getArraySchema(title, createDefaultSchema(types[1], `${title} 子项`));
            }
            return getArraySchema(title, createDefaultSchema("object", `${title} 子项`));
    }

    return null;
}

/**
 * 动态生成jsonschema
 * @export
 * @param {Array<any>} list
 * @param {string} [title=""]
 * @param {string} [dataType="object"]
 * @returns
 */
export function createJsonSchema(list: Array<any>, title = "", dataType = "object") {
    const schema: any = createDefaultSchema(dataType, title);

    if (!schema) {
        return;
    }

    if (schema.type === "object") {
        if (list) {
            list.forEach(({identifier, name, dataType: dataType1, parameterList}) => {
                const identifier1 = identifier.split("|")[0];
                const schemaOfChild = createJsonSchema(parameterList, name || identifier1, dataType1);

                schema.required = [...(schema.required || []), identifier1];

                if (schemaOfChild) {
                    schema.properties = {
                        ...(schema.properties || {}),
                        [identifier1]: schemaOfChild
                    };
                }

            });
        }
    } else if (schema.type === "array") {
        schema.items = createJsonSchema(list, schema.items.title, schema.items.type || "any");
    }

    return schema;
}

// const a = [
//     {id: 249144, identifier: "productIds", name: "销售wid", remark: "", parameterList: [], validator: "", dataType: ""}
// ];

// console.log(JSON.stringify(createJsonSchema(a, "测试schema")));
