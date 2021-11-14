module.exports = () => {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var hour = now.getHours();
  var min = now.getMinutes();
  var se = now.getSeconds();
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (min < 10) min = "0" + min;
  if (se < 10) se = "0" + se;
  var time = year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + se;    //（格式化"yyyy-MM-dd"）   
  return time
}