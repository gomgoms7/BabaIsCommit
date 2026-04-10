const github = require('@actions/github');

async function getContributions(userName, token) {
  const octokit = github.getOctokit(token);
  const query = `
    query($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  // 쿼리 실행 및 데이터 반환
  console.log(`[BabaIsCommit] ${userName}님의 깃허브 잔디 데이터를 불러오는 중...`);
  const response = await octokit.graphql(query, { userName });
  
  return response.user.contributionsCollection.contributionCalendar;
}

// 다른 파일에서 이 함수를 쓸 수 있게 내보내기
module.exports = getContributions;