# rap自动转换成接口方法

把rap接口文档平台，转换成元数据。利用接口元数据，可以高度定制化生成前端接口层代码，接口mock平台和接口测试平台。

## 配置文件

```json
{
	// rap的域名
	"rapPath": "http://rap.internal.baidu.com",
	// modelproxy的路径
	"mpPath": "../mp/proxy",
	// 模板路径
	"tempPath": "../temps/index.ts.art",
	// 需要配置的项目
    "products": [
        {
			// 项目id
			"productId": 111,
			// 命名空间
			"nameSpace": "Sale",
			// 生成文件的路径
			"path": "./apis",
			// modelproxy的默认配置
            "mpConfig": {
                "state": "qa",
                "states": {
                    "dev": "//scloud.baidudev.com",
                    "qa": "//m-scloud.baiduqa.com",
                    "prd": "//api.scloud.baidu.com"
                }
            }
        },
        {
            "productId": 106,
            "nameSpace": "Custom",
            "path": "./apis",
            "mpConfig": {
                "state": "qa",
                "states": {
                    "dev": "https://mapi.baidudev.com",
                    "qa": "https://mapi.baiduqa.com",
                    "prd": "https://mapi.baidu.com"
                }
            }
        }
    ]
}
```