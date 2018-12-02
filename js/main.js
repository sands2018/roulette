/* z-index:
    0     - main div;
    99   - number queue;
    3001 - show gameboard/keyboard
    3002 - gameboard;
    3003 - keyboard
    9999 - div import/export
*/

// styles: ----------------------------------------------------------------

var g_s_theme_id = 1;

var g_astrNumberColor =
[
    "g",
    "r", "b", "r", "b", "r", "b", "r", "b", "r", "b", "b", "r",
    "b", "r", "b", "r", "b", "r", "r", "b", "r", "b", "r", "b",
    "r", "b", "r", "b", "b", "r", "b", "r", "b", "r", "b", "r"
];

// number text color:
var g_s_c_num = ["white", "#434343", "#f3f3f3"];

// number background color:
var g_s_c_num_bk_g = ["#35A300", "white", "white"]; // green
var g_s_c_num_bk_r = ["#CC2200", "white", "white"]; // red
var g_s_c_num_bk_b = ["#222222", "white", "white"]; // black
var g_s_c_num_bk_s = ["#35A300", "white", "white"]; // switch

// queue background color:
var g_s_c_que_bk_g = ["35A300", "#D3EED3", "white"]; // green
var g_s_c_que_bk_r = ["CC2200", "white", "white"]; // red
var g_s_c_que_bk_b = ["222222", "#EAEAEA", "white"]; // black

// queue border color:
var g_s_c_que_b_g = ["white", "#CCFFCC", "white"];
var g_s_c_que_b_r = ["white", "#FFDDAA", "white"];
var g_s_c_que_b_b = ["white", "#DDDDDD", "white"];

// button background color:
var g_s_c_btn_bk_enabled = ["#008838", "white", "white"];
var g_s_c_btn_bk_disabled = ["#888888", "white", "white"];

// button text color:
var g_s_c_btn_enabled = ["white", "#AA8833", "#f3f3f3"];
var g_s_c_btn_disabled = ["white", "BBBBBB", "#f3f3f3"];

// button border color:
var g_s_c_btn_b_enabled = ["white", "#AA8833", "white"];
var g_s_c_btn_b_disabled = ["white", "BBBBBB", "white"];

// 3c3r color
var g_s_c_3c3r = ["black", "black", "#f3f3f3"]; // text color
var g_s_c_3c3r_bk = ["#EBE3CB", "white", "white"]; // background color
var g_s_c_3c3r_t_bk = ["#DFD7CB", "white", "white"]; // title background color

// 3c3r >=5 color
var g_s_c_3c3r_5 = ["white", "black", "#f3f3f3"]; // text color
var g_s_c_3c3r_5_bk = ["rgb(158,118,200)", "#EEEEEE", "white"]; // background color
var g_s_c_3c3r_5_t_bk = ["rgb(128,88,158)", "#DDDDDD", "white"]; // title background color

// 3c3r >=6 background color
var g_s_c_3c3r_6 = ["white", "black", "#f3f3f3"]; // text color
var g_s_c_3c3r_6_bk = ["rgb(0,128,255)", "#EBE3CB", "white"]; // background color
var g_s_c_3c3r_6_t_bk = ["rgb(0,93,218)", "#DFD7CB", "white"]; // title background color

// 3c3r border color
var g_s_c_3c3r_b = ["white", "#AA8833", "white"];

// stats groups active button background color
var g_s_c_sg_bk_active = "#EBE3CB";

// global variables: --------------------------------------------

var QUEUE_MAX_COUNT = 100;
var QUEUE_LINE_NUM_COUNT = 15;

var g_queue = new CNumQueue();


var g_status = new CSysStatus();

var g_3C3R = new CIndexedArray();


function ChangeTheme(theme)
{
    var csslink = document.getElementById("linkTheme");
    csslink.href = "css/" + theme + ".css";
}


function GetNumberColor()
{
    return g_s_c_num[g_s_theme_id];
}

function GetNumberClass(num)
{
    var strColor = g_astrNumberColor[num];

    if (strColor == "r")
    {
        return "tdRed";
    }
    else if (strColor == "b")
    {
        return "tdBlack";
    }
    else
    {
        return "tdGreen";
    }
}

function GetNumberBackgroundColor(num)
{
    var strColor = g_astrNumberColor[num];

    if (strColor == "r")
    {
        return g_s_c_num_bk_r[g_s_theme_id];
    }
    else if (strColor == "b")
    {
        return g_s_c_num_bk_b[g_s_theme_id];
    }
    else
    {
        return g_s_c_num_bk_g[g_s_theme_id];
    }
}

function GetQueueNumberBackgroundColor(num)
{
    var strColor = g_astrNumberColor[num];

    if (strColor == "r")
    {
        return g_s_c_que_bk_r[g_s_theme_id];
    }
    else if (strColor == "b")
    {
        return g_s_c_que_bk_b[g_s_theme_id];
    }
    else
    {
        return g_s_c_que_bk_g[g_s_theme_id];
    }
}

function GetQueueNumberBorderColor(num)
{
    var strColor = g_astrNumberColor[num];

    if (strColor == "r")
    {
        return g_s_c_que_b_r[g_s_theme_id];
    }
    else if (strColor == "b")
    {
        return g_s_c_que_b_b[g_s_theme_id];
    }
    else
    {
        return g_s_c_que_b_g[g_s_theme_id];
    }
}

function GetQueueItemBorderStyle(num)
{
    return "1px solid " + GetQueueNumberBorderColor(num);
}


function GetColRowSpec(nIdx3C3R)
{
    var strSpec;

    if (nIdx3C3R < 3)
    {
        if (nIdx3C3R == 0)
            strSpec = "一组";
        else if (nIdx3C3R == 1)
            strSpec = "二组";
        else
            strSpec = "三组";
    }
    else
    {
        strSpec = (nIdx3C3R - 3 + 1).toString() + "行";
    }

    return strSpec;
}



function Show_RefreshTheme()
{
    var strTitle = "淡雅";

    if (g_s_theme_id == 1)
    {
        strTitle = "彩色";
    }
    var bttn = document.getElementById("tdBttnTheme");
    bttn.innerHTML = strTitle;

    Show_3C3R();
    Show_Queue();
    Show_RefreshSysButtons();
}

function Show_3C3R()
{
    // show:
    for (var n = 0; n < 6; ++n)
    {
        var strIdTd = "td3C3R" + n.toString();
        var td = document.getElementById(strIdTd);
        td.innerHTML = g_3C3R.IndexedValue(n);
        strIdTd = "tdT3C3R" + n.toString();
        var strTitle = GetColRowSpec(g_3C3R.anIdx[n]);
        var tdT = document.getElementById(strIdTd);
        tdT.innerHTML = strTitle;

        if (g_3C3R.IndexedValue(n) >= 5)
        {
            if (g_3C3R.IndexedValue(n) > 5)
            {
                td.style.color = g_s_c_3c3r_6[g_s_theme_id];
                tdT.style.color = g_s_c_3c3r_6[g_s_theme_id];
                td.style.backgroundColor = g_s_c_3c3r_6_bk[g_s_theme_id];
                tdT.style.backgroundColor = g_s_c_3c3r_6_t_bk[g_s_theme_id];
            }
            else
            {
                td.style.color = g_s_c_3c3r_5[g_s_theme_id];
                tdT.style.color = g_s_c_3c3r_5[g_s_theme_id];
                td.style.backgroundColor = g_s_c_3c3r_5_bk[g_s_theme_id];
                tdT.style.backgroundColor = g_s_c_3c3r_5_t_bk[g_s_theme_id];
            }
            td.style.fontWeight = "bold";
        }
        else
        {
            td.style.color = g_s_c_3c3r[g_s_theme_id];
            tdT.style.color = g_s_c_3c3r[g_s_theme_id];
            td.style.backgroundColor = g_s_c_3c3r_bk[g_s_theme_id];
            tdT.style.backgroundColor = g_s_c_3c3r_t_bk[g_s_theme_id];

            td.style.fontWeight = "normal";
        }

        td.style.borderColor = g_s_c_3c3r_b[g_s_theme_id];
        tdT.style.borderColor = g_s_c_3c3r_b[g_s_theme_id];
    }
}

function Show_Queue()
{
    var nStart = 0;
    if (g_queue.nIDX > QUEUE_MAX_COUNT)
        nStart = g_queue.nIDX - QUEUE_MAX_COUNT + 1;

    for (var n = nStart; n <= g_queue.nIDX; ++n)
    {
        var nn = (n - nStart);
        var nIdx = g_queue.nIDX - nn;

        var strIdTd = "td" + nn.toString();
        var td = document.getElementById(strIdTd);
        td.innerHTML = g_queue.anNum[nIdx];
        td.style.backgroundColor = GetQueueNumberBackgroundColor(g_queue.anNum[nIdx]);
        td.style.color = GetNumberColor();
        td.style.border = GetQueueItemBorderStyle(g_queue.anNum[nIdx]);
    }

    for (var n = g_queue.nIDX + 1; n < QUEUE_MAX_COUNT; ++n)
    {
        var strIdTd = "td" + n.toString();
        var td = document.getElementById(strIdTd);
        td.innerHTML = "&nbsp;";
        td.style.backgroundColor = "#FFFFFF";
        td.style.border = "0";
    }

    var nQueueRow = 0;

    if (g_queue.nIDX >= 0)
    {
        nQueueRow = Math.floor((g_queue.nIDX - nStart) / QUEUE_LINE_NUM_COUNT) + 1;
    }

    if (g_queue.nIDX < QUEUE_LINE_NUM_COUNT)
    {
        g_status.QueueExpand = 0;
    }

    var nLineCount = (QUEUE_MAX_COUNT / QUEUE_LINE_NUM_COUNT).toFixed(0);

    for (var n = 1; n <= nLineCount; ++n)
    {
        var strID = "trRow" + n.toString();
        var tr = document.getElementById(strID);
        if ((nQueueRow > 0) && ((n == 1) || ((n <= nQueueRow) && (g_status.QueueExpand == 1))))
            tr.style.display = "";
        else
            tr.style.display = "none";
    }
}

function Show_RefreshSysButtons()
{
    var strBkClrDisabled = g_s_c_btn_bk_disabled[g_s_theme_id];
    var strBkClrEnabled = g_s_c_btn_bk_enabled[g_s_theme_id];

    var strClrDisabled = g_s_c_btn_disabled[g_s_theme_id];
    var strClrEnabled = g_s_c_btn_enabled[g_s_theme_id];

    var strBorderClrDisabled = g_s_c_btn_b_disabled[g_s_theme_id];
    var strBorderClrEnabled = g_s_c_btn_b_enabled[g_s_theme_id];

    var astrIDBttn = ["tdBttnTheme", "tdBttnRestart", "tdBttnDelete", "tdBttnRestore", "tdBttnExport", "tdBttnImport", "tdBttnStatsFinally"];
    var abEnabled = [];

    for (var n = 0; n < astrIDBttn.length; ++n)
    {
        abEnabled[n] = true;
    }

    if (g_queue.nIDX < 0)
    {
        abEnabled[1] = false; // restart
        abEnabled[2] = false; // delete
        abEnabled[4] = false; // export
        abEnabled[6] = false; // stats finally
    }
    else
    {
        abEnabled[3] = false; // restore
    }

    for (var n = 0; n < astrIDBttn.length; ++n)
    {
        var bttn = document.getElementById(astrIDBttn[n]);
        bttn.style.backgroundColor = abEnabled[n] ? strBkClrEnabled : strBkClrDisabled;
        bttn.style.color = abEnabled[n] ? strClrEnabled : strClrDisabled;
        bttn.style.borderColor = abEnabled[n] ? strBorderClrEnabled : strBorderClrDisabled;
    }
}


function Calc_AddNum(num)
{
    g_queue.AddNum(num);
}

function Show_AddNum()
{
    Show_Queue();
    Show_3C3R();
}

function PageInit_Data()
{
    g_3C3R.Reset(6);
    g_status.Reset();
    g_queue.Reset();
}


function Init_Theme()
{
    for (var n = 0; n <= 36; ++n)
    {
        var tdK = document.getElementById("tdK" + n.toString());
        tdK.className = GetNumberClass(n);

        var tdB = document.getElementById("tdB" + n.toString());
        tdB.className = GetNumberClass(n);
    }
}

function OnPageInit()
{
    PageInit_Data();

    Show_Keyboard(true);
    Show_3C3R();
    Init_Theme();
    Show_RefreshTheme();
}


function OnSwitchInput(nIdx)
{
    var divK = document.getElementById("divKeyboard");
    var divB = document.getElementById("divGameBoard");

    if (nIdx == 0)
    {
        divK.style.display = "none";
        divB.style.display = "";
        g_status.KeyboardID = "B";
    }
    else
    {
        divB.style.display = "none";
        divK.style.display = "";
        g_status.KeyboardID = "K";
    }
}

function OnSysChangeTheme()
{
    if (g_s_theme_id > 1)
        return;

    if (g_s_theme_id == 0)
    {
        g_s_theme_id = 1;
    }
    else
    {
        g_s_theme_id = 0;
    }

    Show_RefreshTheme();
}

function OnSysExpand()
{
    g_status.QueueExpand++;
    g_status.QueueExpand = g_status.QueueExpand % 2;

    Show_Queue();
    Show_RefreshSysButtons();
}


function Show_Keyboard(bShow)
{
    var strDisplay = "";

    if (!bShow)
        strDisplay = "none";

    var strID = "divGameBoard";
    var strIDAnother = "divKeyboard";

    if (g_status.KeyboardID == "K")
    {
        var strID = "divKeyboard";
        var strIDAnother = "divGameBoard";
    }

    var div = document.getElementById(strID);
    div.style.display = strDisplay;

    div = document.getElementById(strIDAnother);
    div.style.display = "none";

    var divKB = document.getElementById("divShowKeyboard");
    divKB.style.display = bShow ? "none" : "";
}

function OnShowKeyboardClick()
{
    if (g_nShowInputStatus == 1)
    {
        Show_Keyboard(false);
    }
    else
    {
        Show_Keyboard(true);
    }

}

function OnHideKeyboard()
{
    Show_Keyboard(false);
}

function OnShowKeyboard()
{
    Show_Keyboard(true);
}

function OnEscape()
{
    g_nEscapeStatus++;
    g_nEscapeStatus = g_nEscapeStatus % 2;

    Show_Covers();
}

function OnAddNum(num)
{
    Calc_AddNum(num);
    Show_AddNum();
}
