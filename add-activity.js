const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const run = (commands) => {
  execSync(commands.join(' '), { stdio: 'inherit' });
};

const message = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `Contribution: ${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `"${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}"`;
};

const contribute = (date) => {
  const readmePath = path.join(process.cwd(), 'README.md');
  const msg = message(date);
  fs.appendFileSync(readmePath, msg + '\n\n');
  run(['git', 'add', '.']);
  run(['git', 'commit', '-m', `"${msg}"`, '--date', formatDate(date)]);
};

const main = () => {
  // From Jan 1, 2025 to June 1, 2025
  const startDate = new Date('2025-01-01T20:00:00');
  const endDate = new Date('2025-06-01T20:00:00');
  
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  for (let n = 0; n <= totalDays; n++) {
    let day = new Date(startDate.getTime());
    day.setDate(day.getDate() + n);

    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
    // Little contribution: 30% frequency, max 2 commits, no weekends
    if (!isWeekend && (Math.random() * 100 < 30)) {
      const commits = Math.floor(Math.random() * 2) + 1; // 1 or 2 commits
      for (let m = 0; m < commits; m++) {
        let commitTime = new Date(day.getTime());
        commitTime.setMinutes(commitTime.getMinutes() + m);
        contribute(commitTime);
      }
    }
  }

  run(['git', 'push', 'origin', 'main']);
  console.log('Successfully added early 2025 contributions!');
};

main();
