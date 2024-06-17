let paginationControl = () => {
    $('#img_container').pagination({
        dataSource: '/getImageList',
        locator: 'items',
        totalNumberLocator: function (response) {
            return Math.floor(Math.random() * (1000 - 100)) + 100;
        },
        pageSize: 20,
        ajax: {
            beforeSend: function () {
                dataContainer.html('Loading ...');
            }
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = template(data);
            dataContainer.html(html);
        }
    })
}