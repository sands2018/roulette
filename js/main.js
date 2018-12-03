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

    if (g_status.ThemeID == 0)
    {
        strTitle = "彩色";
    }
    var bttn = document.getElementById("tdBttnTheme");
    bttn.innerHTML = strTitle;

    ChangeTheme((g_status.ThemeID == 0)? "normal" : "color");

    //Show_3C3R();
    Show_Queue();
    Show_RefreshSysButtons();
}

function Show3C3RItem(n, nValue, nIdx)
{
    var strIdTd = "td3C3R" + n.toString();
    var td = document.getElementById(strIdTd);
    td.innerHTML = nValue.toString();
    strIdTd = "tdT3C3R" + n.toString();
    var strTitle = GetColRowSpec(nIdx);
    var tdT = document.getElementById(strIdTd);
    tdT.innerHTML = strTitle;

    if (nValue >= 5)
    {
        if (nValue > 5)
        {
            td.className = "td3C3R_v td3C3RV6";
            tdT.className = "td3C3R_t td3C3RT6";
        }
        else
        {
            td.className = "td3C3R_v td3C3RV5";
            tdT.className = "td3C3R_t td3C3RT5";
        }
        td.style.fontWeight = "bold";
    }
    else
    {
        td.className = "td3C3R_v td3C3RV";
        tdT.className = "td3C3R_t td3C3RT";

        td.style.fontWeight = "normal";
    }
}

function Show_3C3R()
{
    g_3C3R.Sort(false);

    if (g_status.Seperate3C3R == "F")
    {
        for (var n = 0; n < 6; ++n)
            Show3C3RItem(n, g_3C3R.IndexedValue(n), g_3C3R.anIdx[n]);
    }
    else
    {
        var nn = 0;
        for (var n = 0; n < 6; ++n)
        {
            if (g_3C3R.anIdx[n] < 3)
            {
                Show3C3RItem(nn, g_3C3R.IndexedValue(n), g_3C3R.anIdx[n]);
                ++nn;
            }
        }

        for (var n = 0; n < 6; ++n)
        {
            if (g_3C3R.anIdx[n] >= 3)
            {
                Show3C3RItem(nn, g_3C3R.IndexedValue(n), g_3C3R.anIdx[n]);
                ++nn;
            }
        }
    }

    var strDisplay = "";
    var strDisplayOther = "none";

    if (g_queue.nIDX >= 0)
    {
        strDisplay = "none";
        strDisplayOther = "";
    }

    var strID1 = "td3C3R2";
    var strID1Other = "td3C3R4";

    if (g_status.Seperate3C3R == "F")
    {
        strID1 = "td3C3R4";
        strID1Other = "td3C3R2";
    }

    var td1 = document.getElementById(strID1);
    var td1Other = document.getElementById(strID1Other);
    var td2 = document.getElementById("td3C3R5");

    td1.style.display = strDisplay;
    td1Other.style.display = strDisplayOther;
    td2.style.display = strDisplay;
}

function Calc_Columns(aPair)
{
    var anSelected = [];
    for (var n = 0; n < g_anColumnsStart.length; ++n)
    {
        anSelected[n] = 0;
    }

    for (var n1 = 0; n1 < g_anColumnsStart.length; ++n1)
    {
        var nIdx1 = g_t_anIdxColumnsCount[n1];
        if (g_t_anColumnsCount[nIdx1] < 5)
            break;

        if (anSelected[n1] != 0)
            continue;

        var nFound1 = nIdx1;
        var nFound2 = -1;

        for (var n2 = n1 + 1; n2 < g_anColumnsStart.length; ++n2)
        {
            var nIdx2 = g_t_anIdxColumnsCount[n2];
            if (g_t_anColumnsCount[nIdx2] < 5)
                break;

            if (anSelected[n2] != 0)
                continue;

            if ((nIdx2 != (nIdx1 + 1)) && (nIdx2 != (nIdx1 - 1)))
            {
                var bFound = true;

                if ((nIdx2 % 2) == 0)
                {
                    if ((nIdx2 == nIdx1 + 2) || (nIdx2 == nIdx1 - 2))
                        bFound = false;
                }

                if (bFound)
                {
                    nFound2 = nIdx2;
                    anSelected[n2] = 1;
                    break;
                }
            }
        }

        if (nFound2 > 0)
        {
            anSelected[n1] = 1;

            var pair = new CPair();
            pair.value1 = nFound1;
            pair.value2 = nFound2;

            aPair.push(pair);
        }
    }
}


function Show_Columns()
{
    var aPair = [];
    Calc_Columns(aPair);

    var div = document.getElementById("divColumns");
    var strHtml = "";
    var bFirst = true;

    /*
    for(var n = 0; n < g_anColumnsStart.length; ++ n)
    {
        if (!bFirst)
            strHtml += "&nbsp;";
        bFirst = false;

        if (n == 6)
            strHtml += "<br>";

        strHtml += "<span class='" + ((anStatus[n] == 0) ? "ColumnNormal" : "ColumnHighlight") + "'>";
        strHtml += "&nbsp;" + GetColumnSpec(g_t_anIdxColumnsCount[n]) + "&nbsp;<span class='ColumnsCount'>" + g_t_anColumnsCount[g_t_anIdxColumnsCount[n]].toString() + "</span>&nbsp;</span>";
    }
    */

    for (var n = 0; n < aPair.length; ++n)
    {
        if ((n != 0) && ((n % 2) == 0))
            strHtml += "<br>";
        else if (!bFirst)
            strHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

        bFirst = false;


        strHtml += "[&nbsp;" + GetColumnSpec(aPair[n].value1) + "&nbsp;<span class='ColumnsCount'>" + g_t_anColumnsCount[aPair[n].value1].toString() + "</span>&nbsp;&nbsp;&nbsp;";
        strHtml += "&nbsp;" + GetColumnSpec(aPair[n].value2) + "&nbsp;<span class='ColumnsCount'>" + g_t_anColumnsCount[aPair[n].value2].toString() + "</span>&nbsp;]";
    }

    var bShow = true;

    if (aPair.length <= 0)
    {
        bShow = false;
        bFirst = true;
        for (var n = 0; n < g_t_anColumnsCount.length; ++n)
        {
            if (g_t_anColumnsCount[g_t_anIdxColumnsCount[n]] < 10)
                break;

            bShow = true;

            if ((n != 0) && ((n % 3) == 0))
                strHtml += "<br>";
            else if (!bFirst)
                strHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            bFirst = false;

            strHtml += "&nbsp;" + GetColumnSpec(g_t_anIdxColumnsCount[n]) + "&nbsp;<span class='ColumnsCount'>" + g_t_anColumnsCount[g_t_anIdxColumnsCount[n]].toString() + "</span>&nbsp;";
        }
    }

    div.innerHTML = strHtml;

    if (bShow)
        div.style.display = (g_nColumnsStatus == 0) ? "none" : "";
    else
        div.style.display = "none";
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
        td.className = GetNumberClass(g_queue.anNum[nIdx]);
    }

    for (var n = g_queue.nIDX + 1; n < QUEUE_MAX_COUNT; ++n)
    {
        var strIdTd = "td" + n.toString();
        var td = document.getElementById(strIdTd);
        td.innerHTML = "&nbsp;";
        td.className = "tdEmpty";
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
        bttn.className = abEnabled[n] ? "tdSBEnabled" : "tdSBDisabled";
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

    if (g_bDebug)
        ChangeTheme("debug");
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

    WriteData(DATA_KEYBOARDID, g_status.KeyboardID);
}

function OnSysChangeTheme()
{
    if (g_status.ThemeID > 1)
        return;

    g_status.ThemeID++;
    g_status.ThemeID = g_status.ThemeID % 2;

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

function OnSeperate3C3RClick()
{
    g_status.Seperate3C3R = SwitchTrueFalse(g_status.Seperate3C3R);
    WriteData(DATA_SEPERATE3C3R, g_status.Seperate3C3R);

    Show_3C3R();
}

function OnAddNum(num)
{
    Calc_AddNum(num);
    Show_AddNum();
    Calc_3C3R_AddNum(num);
    Show_3C3R();
}
