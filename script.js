var disenable = true
var c = document.querySelector("canvas");
var ctx = c.getContext("2d");
var color = 'red'
var canvasNames
var opened = false
var deleteEnable = false
var x = localStorage.getItem('canvasNames')
var startenable = true

if (x) {
    canvasNames = JSON.parse(x)
} else {
    canvasNames = []
}
var data = { name: '', datas: [] }
function draw(e) {
    data['datas'].push({ "color": color, "posX": e.offsetX, "posY": e.offsetY })
    ctx.beginPath()
    ctx.arc(e.offsetX, e.offsetY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color
    ctx.fill()
}
document.querySelector('canvas').addEventListener('mousedown', (e) => {
    disenable = false
})
document.querySelector('canvas').addEventListener('mouseup', (e) => {
    disenable = true
})
document.querySelector('canvas').addEventListener('mousemove', (a) => {
    if (disenable) return
    draw(a)
})
$("#picker1").colorPick({
    'initialColor': '#8e44ad',
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1"],
    'onColorSelected': function () {
        color = this.color
        this.element.css({ 'backgroundColor': this.color, 'color': this.color });
    }
});
$('.picker').offset({ top: $('canvas').offset().top + 10, left: $('canvas').offset().left + 10 })
$('.operations').offset({ top: $('canvas').offset().top + $('canvas').height() + 10, left: $('canvas').offset().left })
$('.operations').width($('canvas').width())
$('.save').click(function () {
    $('.onsave').html('<button class="btn btn-primary col-2 onok">OK</button><button class="btn btn-danger col-4 oncancel">Cancel</button><input type="text" class="col-6 form-control dataname">')
    $('.onsave').css('display', 'flex')
    $('.oncancel').click(function () {
        $('.onsave').html('<button class="btn btn-danger clear col-3">Clear</button>')
        activateClearClick()
        getOptions()
    })
    $('.onok').click(function () {
        if (!($('.dataname').val())) return
        localStorage.setItem($('.dataname').val(), `[${String(data['datas'].map(a => JSON.stringify(a)))}]`)
        canvasNames.push($('.dataname').val())
        localStorage.setItem('canvasNames', JSON.stringify(canvasNames.map(a => `${a}`)))
        $('.oncancel').click()
    })

})
$('.open').click(function () {
    if (opened) {
        $('select').css('visibility', 'hidden')
        $(this).text('Open')
        opened = !opened
        $('.clear').text('clear')
        deleteEnable = false
    } else {
        $('select').css('visibility', 'visible')
        $(this).text('Close')
        $('select').val('first')
        opened = !opened
        $('.clear').text('delete')
        deleteEnable = true
    }

})
function activateClearClick() {
    $('.clear').click(function () {
        if (deleteEnable) {
            value = $('select').val()
            if (value != 'first') {
                canvasNames = canvasNames.filter(a => a != value)
                localStorage.removeItem(value)
                localStorage.setItem('canvasNames', JSON.stringify(canvasNames))
                getOptions()
                ctx.clearRect(0, 0, c.width, c.height)
            }
            return
        }
        ctx.clearRect(0, 0, c.width, c.height)
        data['datas'] = []
    })
}
function getOptions() {
    selectHTML = '<select class="custom-select col-9"><option selected value="first">Search Paints</option>'
    if (canvasNames.length != 0) {
        for (k of canvasNames) {
            selectHTML += `<option value="${k}">${k}</option>`
        }
    }
    selectHTML += '</select>'
    $('.clear').siblings().remove()
    $(selectHTML).insertAfter('.clear')
    $(selectHTML).val('first')
    if(deleteEnable){
        $('select').css('visibility','visible')
    }
    $('select').change(function () {
        if(!startenable)return
        arr = JSON.parse(localStorage.getItem($(this).val()))
        drawOption(arr)
    })
}
function drawOption(arr) {
    startenable = false
    ctx.clearRect(0, 0, c.width, c.height)
    if (!arr){
        startenable = true
        return
    }
    arr.forEach((k,m) => {
        setTimeout(function(){
            ctx.beginPath()
            ctx.arc(k.posX, k.posY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = k.color
            ctx.fill()
            if(m == arr.length - 1){
                startenable = true
            }  
        },1000/20)
            
    })
}
getOptions()
activateClearClick()
