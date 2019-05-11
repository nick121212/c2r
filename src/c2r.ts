import program from "commander";

program
  .version('0.1.0')
  .option('-c, --config <path>', 'set config path. defaults to ./c2r.json');

program
  .command('create')
  .description('从数据源导出一个项目，并在本地创建。')
  .option('-s, --source <source>', '接口数据的来源，目前只支持RAP', "RAP")
  .option('-i, --productId <id>', 'RAP的项目ID')
  .option('-n, --nameSpace <ns>', 'RAP的项目命名空间')
  .option('-p, --path <path>', '文件存放路径')
  .option('-c, --config <config>', 'modelproxy的配置')
  .action((options) => {
    const {source = "RAP", productId, path, nameSpace, config} = options;

    require("./cmds/create").default(source, {productId, path, nameSpace, config});
  });

program
  .command('config')
  .description('读取配置文件，生成API。')
  .option('-c, --config <path>', 'set config path. defaults to ./c2r.json', "./c2r.json")
  .action(function (options) {
    const {config} = options;

    require("./cmds/config").default(config);
  });

program.parse(process.argv);
