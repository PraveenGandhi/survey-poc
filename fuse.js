const { RawPlugin,FuseBox, HTMLPlugin,CSSPlugin, EnvPlugin, TerserPlugin, WebIndexPlugin } = require("fuse-box");
const { src, task } = require("fuse-box/sparky");
let TypeHelper = require('fuse-box-typechecker').TypeHelper

var autoLoadAureliaLoaders =function() {
    class loader {
        constructor() { }
        init(context) { }
        bundleEnd(context) {
            context.source.addContent(`FuseBox.import("fuse-box-aurelia-loader")`);
            context.source.addContent(`FuseBox.import("aurelia-bootstrapper")`);
            // context.source.addContent(`FuseBox.import("socket-io-client")`);
        }
    }
    return new loader();
}

task('typechecker', () => {
    var testWatch = TypeHelper({
        tsConfig: './tsconfig.json',
        name: 'Seed',
        basePath: './',
        tsLint: './tslint.json',
        shortenFilenames: true,
        yellowOnLint: true,
    })
    testWatch.runWatch('./src')
    return true;
});

let run = (production) => {
    let env = {
        FB_AU_LOG: !production,
        devMode: !production
    }
    const fuse = FuseBox.init({
        homeDir: 'src',
        output: 'dist/$name.js',
        target:"browser@es6",
        runAllMatchedPlugins: true,
        plugins: [
            autoLoadAureliaLoaders(),
            production && TerserPlugin(),
            CSSPlugin(),
            EnvPlugin(env),
            HTMLPlugin(),
            RawPlugin(['.css', '.woff','.png']),
            WebIndexPlugin({template:'./index.html'})
        ]
    });

    fuse.register('materialize-css-styles', {
        homeDir: 'node_modules/materialize-css',
        main: 'dist/css/materialize.min.css',
        instructions: ' '
    });
    
    // Register the bridge and its contents.
    fuse.register('aurelia-materialize-bridge', {
        homeDir: 'node_modules/aurelia-materialize-bridge/dist/commonjs',
        main: 'index.js',
        instructions: '**/*.{html,css,js}'
    });
    fuse.bundle("vendor")
        .cache(true)
        .instructions(`fuse-box-css
        + aurelia-bootstrapper
        + fuse-box-aurelia-loader
        + aurelia-framework
        + aurelia-pal-browser
        + aurelia-logging-console
        + aurelia-templating-binding
        + aurelia-templating-resources
        + aurelia-event-aggregator
        + aurelia-history-browser
        + aurelia-templating-router
        + materialize-css-styles
        + aurelia-typed-observable-plugin
        + aurelia-materialize-bridge
        + aurelia-validation`)
        .alias({
            'jQuery': 'jquery'
        })
        .shim({
            jquery: {
                source: 'node_modules/jquery/dist/jquery.js',
                exports: '$'
            },
            'materialize-css': {
                source: 'node_modules/materialize-css/dist/js/materialize.min.js',
                exports: 'Materialize'
            }
        });
    if (!production) {
        fuse.bundle('app')
            .watch().hmr({reload : true})
            .instructions(`
            > [main.ts]
            + [**/*.{ts,html,css}]
        `);
        fuse.dev();

    } else {
        fuse.bundle('app')
            //.watch().hmr({reload : true})
            .instructions(`
            > [main.ts]
            + [**/*.{ts,html,css}]
        `);
        //fuse.dev();
    }
    fuse.run();
};

task('clean', async () => await src('dist/*').clean('dist').exec());

task('copy', async () => {
  await src('./favicon.ico').dest('./dist').exec();
  //await src('./static/**').dest('./dist').exec();
});

task("dev",  ['clean','copy'
//, 'typechecker'
], () => run(false));

task("prod", ['clean','copy'], () => run(true));