const core = require('@actions/core');
const fs = require('fs');
const getContributions = require('./fetch-data');
const generateSvg = require('./generate-svg'); 
async function run() {
  try {
    const userName = core.getInput('github_user_name') || process.env.GITHUB_USERNAME;
    const token = core.getInput('github_token') || process.env.GITHUB_TOKEN;

    console.log(`${userName} github user name and token received. Fetching contribution data...`);

    const calendarData = await getContributions(userName, token);
    console.log(` (commit: ${calendarData.totalContributions} count)`);

    console.log(`SVG generating... (BABA IS COMMIT!)`);
    const svgContent = generateSvg(calendarData); 

    fs.writeFileSync('baba-is-commit.svg', svgContent);
    console.log(`baba-is-commit.svg successfully created!`);

  } catch (error) {
    core.setFailed(`error : ${error.message}`);
  }
}

run();