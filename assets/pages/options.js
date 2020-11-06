(function () {
    'use strict';

    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
const SERVER = "https://kma-schedule-api.herokuapp.com";
$(document).ready(function () {
    chrome.storage.local.get({ studentCode: "", password: "", semesters: [], selectedSemester: "", selectedTypeSchedule: "" }, function ({ studentCode, password, semesters, selectedSemester, selectedTypeSchedule }) {
        $('#studentCode').val(studentCode);
        $('#password').val(password);
        console.log(selectedSemester, selectedTypeSchedule);
        semesters.forEach(semester => {
            const option = new Option(semester.name, semester.drpSemester);
            option.selected = semester.drpSemester == selectedSemester;
            $("#semesters").append(option);
        });
        $(`#type-schedule option[value="${selectedTypeSchedule}"]`).attr('selected', 'selected');
    })
    $('#btnCheckPassword').click(function (event) {
        event.preventDefault();
        const studentCode = $('#studentCode').val();
        const password = $('#password').val();

        var settings = {
            "url": `${SERVER}/users/login`,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                studentCode,
                password
            }),
        };

        $.ajax(settings)
            .then(function (response) {
                const { error, success } = response;
                if (!success) throw new Error(error.message);
                else {
                    chrome.storage.local.set({ studentCode, password });
                    return $.get(`${SERVER}/schedules/semesters?studentCode=${studentCode}`);
                }

            })
            .then(function (response) {
                if (response.success === false) throw new Error(response.error.message);
                else {
                    chrome.storage.local.set({ semesters: response.data });
                    swal("Good job!", "Đăng nhập thành công", "success");
                    location.reload();
                }
            })
            .catch(function (e) {
                swal({
                    title: "Có lỗi xảy ra",
                    text: e.message,
                    type: "warning",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });
            })
    })

    $('form').submit(function (event) {
        event.preventDefault();
        const studentCode = $('#studentCode').val();
        const selectedSemester = $('#semesters').val();
        const selectedTypeSchedule = $('#type-schedule').val()
        chrome.storage.local.set({ selectedSemester, selectedTypeSchedule });
        const settings = {
            "url": `${SERVER}/schedules/save`,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({ studentCode, drpSemester: selectedSemester }),
        };

        $.ajax(settings)
            .then(function (response) {
                const { error, success } = response;
                if (success === false) throw new Error(error.message);
                else {                    
                    swal("Good job!", "Lưu thành công", "success");
                }
            })
            .catch(function (e) {
                swal({
                    title: "Có lỗi xảy ra",
                    text: e.message,
                    type: "warning",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                });
            })
    })
});