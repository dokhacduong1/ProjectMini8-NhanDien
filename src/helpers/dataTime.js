export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export function getCurrentDay() {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const currentDayName = daysOfWeek[currentDayIndex];
  return currentDayName
}
export function getDataTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Tháng được đánh số từ 0-11, cộng thêm 1 và đảm bảo đủ 2 chữ số.
  const day = String(currentDate.getDate()).padStart(2, "0"); // Đảm bảo đủ 2 chữ số.
 
 
  const formattedTime = `${year}/${month}/${day}`;
  return formattedTime
}
export function getTime(){
  const currentDate = new Date();
  let hour = currentDate.getHours();
  const minute = String(currentDate.getMinutes()).padStart(2, "0");
  const formattedTime = `${hour}:${minute}`; // Đảm bảo đủ 2 chữ số.
  return formattedTime;
}