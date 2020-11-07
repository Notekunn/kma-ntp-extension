const TIME_FORMAT = "DD/MM/YYYY";
const TIME_ZONE = "Asia/Ho_Chi_Minh";
const getDateInWeek = (day) => {
    const days = [];
    day = moment(day, TIME_FORMAT, TIME_ZONE);
    day = day.isValid() ? day : moment.tz(TIME_ZONE);
    for (let i = 0; i <= 6; i++) {
        days.push(day.day(i).format(TIME_FORMAT));
    }
    return days;
}


const getDate = (day) => {
    day = moment(day, TIME_FORMAT, TIME_ZONE);
    day = day.isValid() ? day : moment.tz(TIME_ZONE);
    return day.format(TIME_FORMAT);
}

const groupBy = (iteratee = "day") => {
    return (arr) => {
        return arr.reduce((r, v, i, a, k = v[iteratee]) => ((r[k] || (r[k] = []))
            .push(v), r), {});
    }
}
const makeItem = ({ dayOfWeek, subjectName, lesson, room, teacher, className, subjectCode }) => {
    return `<div class="col-sm-4 pt-2">
    <div class="card">
        <div class="card-header text-center">
            Thứ ${dayOfWeek}
        </div>
        <div class="card-body">
            <h5 class="card-title text-danger">${subjectName}</h5>
            <p class="card-text subject-item">
                <span class="text-success">- Tiết: </span>
                ${lesson},${lesson + 1},${lesson + 2}
            </p>
            <p class="card-text subject-item">
                <span class="text-success">- Phòng: </span>
                ${room}
            </p>
            <p class="card-text subject-item">
                <span class="text-success">- Giáo viên: </span>
                ${teacher}
            </p>
            <p class="card-text subject-item">
                <span class="text-success">- Lớp: </span>
                ${className}
            </p>
            <p class="card-text subject-item">
                <span class="text-success">- Mã học phần: </span>
                ${subjectCode}
            </p>
        </div>
    </div>
</div>`;
}
$(document).ready(function () {
    chrome.storage.local.get({ studentCode: "", lastUpdate: "01/01/1999" }, function ({ studentCode, lastUpdate }) {
        if (!studentCode) return;
        if (lastUpdate == getDate()) return;
        var settings = {
            "url": "https://kma-schedule-api.herokuapp.com/schedules/search",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({ studentCode, days: getDateInWeek() }),
        };

        $.ajax(settings).done(function (response) {
            const { data } = response;
            if (data.length == 0) return;
            $('#noScheduleMessage').remove();
            console.log(data);
            let htmlStr = data.map(makeItem).join("\n");
            $("#schedules").html(htmlStr);
        });
    })

})