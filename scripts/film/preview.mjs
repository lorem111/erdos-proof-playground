import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const quick=process.argv.includes('--quick');
const movie=JSON.parse(readFileSync(quick?'public/movie/quick/chapters.json':'public/movie/chapters.json','utf8'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try {
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 page.on('pageerror',e=>{throw e});await page.goto(`http://127.0.0.1:5173/${quick?'quick-film':'film'}.html`);await page.waitForFunction(()=>window.filmReady);
 for(const [i,ch] of movie.chapters.entries())for(const [name,p] of [['early',.25],['middle',.6],['late',.92]]) {
  await page.evaluate(t=>window.renderFrame(t),ch.start+(ch.end-ch.start)*p);await page.screenshot({path:`.film-cache/${quick?'quick/':''}story-${i}-${name}.png`});
 }
 console.log('21 storyboard frames rendered');
}finally{await browser.close()}
