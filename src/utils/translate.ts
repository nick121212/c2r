import _ from "lodash";
import {youdao, baidu, google} from "translation.js";

/**
 * 翻译类
 */
export class Translate {
    private engines = [baidu, youdao, google];

    /**
     * 首字母大写方法
     * @private
     * @param    {string} result 需要转换的内容
     * @returns  {string}
     * @memberof Translate
     */
    private startCaseClassName(result: string): string {
        let wordArray: Array<string> = _.startCase(result).split(" ");

        if (wordArray.length > 6) {
            wordArray = [...wordArray.slice(0, 5), ...wordArray.slice(-1)];
        }

        return wordArray.join("");
    }

    /**
	 * 翻译中文到英文
	 * @param    {string} text            需要翻译的文本
	 * @param    {number} [engineIndex=0] 使用的翻译引擎
	 * @returns  {Promise<string>}        翻译出来的结果
	 * @memberof Translate
	 */
    public async translateAsync(text: string, engineIndex = 0): Promise<string> {
        let enKey, engine;
        let index = engineIndex;

        if (this.engines.length > index) {
            index = 0;
        }

        engine = this.engines[index];

        try {
            const res = await engine.translate(text);

            if (!res.result) {
                return "";
            }

            enKey = this.startCaseClassName(res.result[0]);

            return enKey;
        } catch (err) {
            return this.translateAsync(text, index + 1);
        }
    }
}
