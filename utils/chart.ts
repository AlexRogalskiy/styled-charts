import { JSDOM, VirtualConsole } from 'jsdom'

import { ImageOptions, ParsedRequest } from '../typings/types'
import { mergeProps, toFormatString, toJsonUrl, toUrl } from './commons'
import { CONFIG } from './config'

const fs = require('fs')
const pathToPlotly = require.resolve('plotly.js-dist')

export async function chartRenderer(parsedRequest: ParsedRequest): Promise<string | void> {
    const url = await toJsonUrl(toUrl(parsedRequest.url)).catch(console.error)
    const options: ImageOptions = mergeProps(CONFIG.imageOptions, parsedRequest.options)

    console.log(
        `\n>>> Generating chart with parameters:
        url=${parsedRequest.url},
        options=${toFormatString(options)}
        `
    )

    const virtualConsole = createVirtualConsole()
    const virtualWindow = createVirtualWindow(virtualConsole)

    return await createChart(url, options, virtualWindow).catch(console.error)
}

const createVirtualConsole = (): VirtualConsole => {
    const virtualConsole = new VirtualConsole()
    virtualConsole.sendTo(console)
    virtualConsole.on('log', message => console.log('console.log called -> ', message))
    virtualConsole.on('jsdomError', message => console.error('Error -> ', message))

    return virtualConsole
}

const createVirtualWindow = (virtualConsole: VirtualConsole): JSDOM => {
    const jsDomWindow = new JSDOM('', {runScripts: 'dangerously', virtualConsole}).window
    jsDomWindow.HTMLCanvasElement.prototype.getContext = () => null
    jsDomWindow.URL.createObjectURL = () => null

    return jsDomWindow
}

const createChart = async (url: unknown, options: ImageOptions, virtualWindow: JSDOM): Promise<string> => {
    return await fs.promises.readFile(pathToPlotly, 'utf-8')
        .then(virtualWindow.eval)
        .then(() => virtualWindow.Plotly.toImage(url, options))
}
