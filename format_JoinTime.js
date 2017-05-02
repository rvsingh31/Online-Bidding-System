
function checkTime(i)
{
	return (i < 10) ? "0" + i : i;
}

function formatTime(time)
{
			h = checkTime(time.getHours());
            m = checkTime(time.getMinutes());
			s=	checkTime(time.getSeconds());
			return_time=h+":"+m+":"+s;
			return return_time;
}

module.exports=formatTime;