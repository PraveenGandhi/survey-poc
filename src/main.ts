import { Aurelia } from 'aurelia-framework';

export async function configure(aurelia: Aurelia) {

    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .feature('resources/index')
        .plugin('aurelia-materialize-bridge', (bridge: any) => bridge.useAll());

    await aurelia.start();
    await aurelia.setRoot('shells/app');
}
