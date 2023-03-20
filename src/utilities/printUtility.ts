const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

export const printPdf = async (templatePath, data, pOutputType) => {
  const templateHtml = fs.readFileSync(
    path.join(
      process.cwd(),
      process.platform === 'linux'
        ? `/src/templates/${templatePath}.html`
        : `src\\templates\\${templatePath}.html`,
    ),
    'utf8',
  );

  const template = handlebars.compile(templateHtml);

  handlebars.registerHelper('if_checkStatus', function (a, opts) {
    if (a === 'RJCT' || a === 'CNL') {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
  handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  const html = template(data);
  // console.log(html);
  let milis = Math.round(+new Date() / 1000); //new Date();
  const pdfPath =
    process.platform === 'linux'
      ? path.join(process.cwd() + '/src/tempPdfs', `${milis}.pdf`)
      : path.join('src\\tempPdfs', `${milis}.pdf`);

  let options = {};

  options = {
    ...options,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    // args: ["--no-sandbox"],
    headless: true,
  });

  if (pOutputType === 'HTML') {
    return html;
  }

  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  console.log(options, 'options');
  const pdf = await page.pdf({
    ...options,
  });

  await browser.close();

  fs.unlink(pdfPath, function (err) {
    if (err) throw err;
    console.log('Temp File deleted!');
  });

  return pdf;
};
