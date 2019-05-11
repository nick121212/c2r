export default {
    key: "rap",
    engine: "fetch",
    states: {
        prd: ""
    },
    state: "prd",
    interfaces: [
        {
            key: "queryRAPModel",
            method: "GET",
            title: "获取rap中项目的详细数据",
            path: "/api/queryRAPModel.do",
            config: {
                jsonata: `
                    $.{
                        "code": $.code,
                        "modelJSON":$jparse($trim($.modelJSON)),
                        "msg": $.msg
                    }
                `
            }
        }
    ]
};
