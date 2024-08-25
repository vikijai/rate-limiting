const fs = require("fs").promises; // Using the promises API
const path = require("path");

const logsPath = path.join(__dirname, "logs.txt");

// Convert the Date object to a human-readable format
function formatDate(date) {
  const month = date.getMonth() + 1; // Months are 0-based
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Custom function to format time as hh:mm:ss AM/PM
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
}

async function appendLogs(log) {
  const formattedBlockedUntil = log.blockedUntil
    ? `${formatDate(new Date(log.blockedUntil))}, ${formatTime(
        new Date(log.blockedUntil)
      )}`
    : "N/A";
    const formattedDate = formatDate(log.date)
    const formattedTime = formatTime(log.date)
  const logEntry = `${formattedDate} ${formattedTime} - IP: ${log.ip} - ${log.method} ${log.url} - Rate Limit Exceeded: ${log.blocked} - Blocked Until: ${formattedBlockedUntil}\n`;
  await fs.appendFile(logsPath, logEntry); // Use appendFile with promises API
}

async function readLogs() {
  try {
    const fileContent = await fs.readFile(logsPath, "utf-8");
    return fileContent;
  } catch (error) {
    return "No logs available yet.";
  }
}

module.exports = { appendLogs, readLogs };
