/* z-index:
    0     - main div;
    99   - number queue;
    3001 - show gameboard/keyboard
    3002 - gameboard;
    3003 - keyboard
    9999 - div import/export
*/

// global variables: ----------------------------------------------------------

var g_queue = new CNumQueue();
var g_status = new CSysStatus();
var g_3C3R = new CStats3C3R();
var g_columns = new CStatsColumns();


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
    g_3C3R.data.Sort(false);

    if (g_status.Seperate3C3R == "F")
    {
        for (var n = 0; n < 6; ++n)
            Show3C3RItem(n, g_3C3R.data.Value(n), g_3C3R.data.anIdx[n]);
    }
    else
    {
        var nn = 0;
        for (var n = 0; n < 6; ++n)
        {
            if (g_3C3R.data.anIdx[n] < 3)
            {
                Show3C3RItem(nn, g_3C3R.data.Value(n), g_3C3R.data.anIdx[n]);
                ++nn;
            }
        }

        for (var n = 0; n < 6; ++n)
        {
            if (g_3C3R.data.anIdx[n] >= 3)
            {
                Show3C3RItem(nn, g_3C3R.data.Value(n), g_3C3R.data.anIdx[n]);
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

function GetColumnSpec(nIdx)
{
    return g_columns.anStart[nIdx].toString() + "-" + (g_columns.anStart[nIdx] + 5).toString();
}


function Show_Columns()
{
    var nMin = g_status.ColumnsCountBttn;
    var nColumnCount = g_columns.anStart.length;
    var nCount = 0;

    for(var n = 0; n < nColumnCount; ++ n)
    {
        if (g_columns.data.Value(n) < nMin)
            break;

        ++nCount;
    }

    var tbl = document.getElementById("tblColumns");
    var tr1 = document.getElementById("trColumns1");
    var tr2 = document.getElementById("trColumns2");

    tbl.style.display = "";
    tr1.style.display = "";
    tr2.style.display = "";

    if (nCount <= 0)
    {
        tbl.style.display = "none";
        return;
    }
    else 
    {
        if(nCount <= 4)
        {
            tr1.style.display = "none";
            tr2.style.display = "none";
        }
        else if(nCount <= 8)
        {
            tr2.style.display = "none";
        }
    }

    var anActive = [];
    for(var n = 0; n < nCount; ++ n)
        anActive[n] = 1;

    for(var n = 0; n < nCount - 1; ++n)
    {
        if (anActive[n] == 0)
            continue;

        if((g_columns.data.anIdx[n] % 2) != 0)
            continue;

        for(var nn = n + 1; nn < nCount; ++ nn)
        {
            var nMinIdx = Math.min(g_columns.data.anIdx[n], g_columns.data.anIdx[nn]);
            var nMaxIdx = Math.max(g_columns.data.anIdx[n], g_columns.data.anIdx[nn]);

            if (((nMinIdx % 4) == 0) && ((nMaxIdx - nMinIdx) == 2))
            {
                anActive[n] = 0;
                anActive[nn] = 0;
                break;
            }
        }
    }

    for(var n = 0; n < 12; ++ n)
    {
        var tdT = document.getElementById("tdColumnsT" + n.toString());
        var tdV = document.getElementById("tdColumnsV" + n.toString());

        if (n >= nCount)
        {
            tdT.innerHTML = "&nbsp;";
            tdV.innerHTML = "&nbsp;";
            tdT.className = "Title Empty";
            tdV.className = "Value Empty";
        }
        else
        {
            tdT.innerHTML = GetColumnSpec(g_columns.data.anIdx[n]);
            tdV.innerHTML = g_columns.data.Value(n).toString();

            if(anActive[n] == 1)
            {
                tdT.className = "Title TActive";
                tdV.className = "Value VActive";
            }
            else
            {
                tdT.className = "Title TInactive";
                tdV.className = "Value VInactive";
            }
        }
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
        td.className = GetNumberClass(g_queue.anNum[nIdx]);
    }

    for (var n = g_queue.nIDX + 1; n < QUEUE_MAX_COUNT; ++n)
    {
        var strIdTd = "td" + n.toString();
        var td = document.getElementById(strIdTd);
        td.innerHTML = "&nbsp;";
        td.className = "Empty";
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
    var astrIDBttn = ["tdBttnTheme", "tdBttnRestart", "tdBttnRestore", "tdBttnExport", "tdBttnImport", "tdBttnStatsFinally"];
    var abEnabled = [];

    for (var n = 0; n < astrIDBttn.length; ++n)
    {
        abEnabled[n] = true;
    }

    if (g_queue.nIDX < 0)
    {
        abEnabled[1] = false; // restart
        abEnabled[3] = false; // export
        abEnabled[5] = false; // stats finally
    }
    else
    {
        abEnabled[2] = false; // restore
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
    g_3C3R.AddNum(num);
    g_columns.ReCalc(g_queue);
}

function Show_AddNum()
{
    Show_Queue();
    Show_3C3R();
    Show_Columns();
    Show_StatsGroupsCount();
    Show_RefreshSysButtons();
}

function PageInit_Data()
{
    g_3C3R.Reset();
    g_columns.Reset();
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
    Show_Columns();
    Show_RefreshColumnsButtons();
    Show_StatsGroupsCount();
    Show_RefreshSGButtons();
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

function SaveNumbers()
{
    var strNum = NumArrayToString(g_queue);
    WriteData(DATA_NUMBERS, strNum);
}

function OnAddNum(num)
{
    Calc_AddNum(num);
    Show_AddNum();
    SaveNumbers();
}

function OnColumnsBttnClick(nMin)
{
    if (nMin == g_status.ColumnsCountBttn)
        return;

    g_status.ColumnsCountBttn = nMin;
    WriteData(DATA_COLUMNSBUTTON, nMin.toString());

    Show_Columns();
    Show_RefreshColumnsButtons();
}

function Show_RefreshColumnsButtons()
{
    var anCount = [3, 4, 5, 6, 7];
    for (var n = 0; n < anCount.length; ++n)
    {
        var td = document.getElementById("tdCBttn" + anCount[n].toString());

        if (anCount[n] == g_status.ColumnsCountBttn)
            td.className = "tdBttn tdSelBttn";
        else
            td.className = "tdBttn";
    }
}

function OnSGCountBttnClick(nIdx)
{
    if (nIdx == g_status.SGCountBttnIdx)
        return;

    g_status.SGCountBttnIdx = nIdx;
    WriteData(DATA_SGCOUNTIDX, nIdx.toString());

    Show_StatsGroupsCount();
    Show_RefreshSGButtons();
}

function Show_RefreshSGButtons()
{
    var nCount = STATS_GROUPS_COUNTS.length;
    var strBkColor = "";

    for (var n = 0; n < nCount; ++n)
    {
        var td = document.getElementById("tdSGCount" + n.toString());

        if (n == g_status.SGCountBttnIdx)
            td.className = "tdBttn tdSelBttn";
        else
            td.className = "tdBttn";
    }
}

function TitleString_StatsGroupsCount(strTitle)
{
    return "<span class='SGCTitle'>" + strTitle + "</span>"
}

function NumberString_StatsGroupsCount(nNum)
{
    return "<span class='SGCNumber'>" + nNum.toString() + "</span>"
}

function Show_StatsGroupsCount()
{
    var stats3C3R = new CIndexedArray();
    Calc_StatsGroupsCount(stats3C3R, g_queue);

    var div = document.getElementById("divStatsGroups");
    var strDisplay = "";
    if (g_queue.nIDX < 0)
        strDisplay = "none";
    div.style.display = strDisplay;

    var tdCol = document.getElementById("tdStatsGroupsCol");
    var strHtml = "";
    var bFirst = true;
    for (var n = 0; n < 6; ++n)
    {
        var nIdx = stats3C3R.anIdx[n];
        if (nIdx >= 3)
            continue;

        if (!bFirst)
            strHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        bFirst = false;

        strHtml += TitleString_StatsGroupsCount(GetColRowSpec(nIdx)) + "&nbsp;";
        strHtml += NumberString_StatsGroupsCount(stats3C3R.anValue[nIdx]);
    }
    tdCol.innerHTML = strHtml;

    strHtml = "";
    var tdRow = document.getElementById("tdStatsGroupsRow");
    bFirst = true;
    for (var n = 0; n < 6; ++n)
    {
        var nIdx = stats3C3R.anIdx[n];
        if (nIdx < 3)
            continue;

        if (!bFirst)
            strHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        bFirst = false;

        strHtml += TitleString_StatsGroupsCount(GetColRowSpec(nIdx)) + "&nbsp;";
        strHtml += NumberString_StatsGroupsCount(stats3C3R.anValue[nIdx]);
    }
    tdRow.innerHTML = strHtml;
}

function OnSysRestore()
{
    if (g_queue.nIDX >= 0)
        return;

    var strNum = ReadData(DATA_NUMBERS);
    var rtn = new CReturnArray();
    NumStringToArray(strNum, rtn);
    if (rtn.rn < 0)
        alert("保存的数据可能已经损坏数");
    else if (rtn.rn == 0)
        alert("没有找到保存的数据");
    else
    {
        var confirmed = confirm("确定要恢复吗？");
        if (confirmed == 0)
            return;

        PageInit_Data();

        for (var n = 0; n < rtn.anVal.length; ++n)
        {
            g_queue.AddNum(rtn.anVal[n]);
            g_3C3R.AddNum(rtn.anVal[n]);
        }

        g_columns.ReCalc(g_queue);

        Show_AddNum();
    }
}

function OnSysExport()
{
    var clipboard = new ClipboardJS('#tdBttnExport');
    var strData = NumArrayToString(g_queue);
    $("#tdBttnExport").attr("data-clipboard-action", "copy");
    $("#tdBttnExport").attr("data-clipboard-text", strData);

    clipboard.on('success', function (e)
    {
        alert("数据已复制到粘贴板");
    });

    clipboard.on('error', function (e)
    {
        alert("数据复制失败");
    });
}

function OnSysImport()
{
    var tdTitle = document.getElementById("tdImportExportTitle");
    var txt = document.getElementById("txtClipboard");
    var trSpecImport = document.getElementById("trSpecImport");
    var trSpecExport = document.getElementById("trSpecExport");
    var tdBttnDoImport = document.getElementById("tdBttnDoImport");

    tdTitle.innerHTML = "导&nbsp;&nbsp;&nbsp;入";
    txt.value = "";
    trSpecImport.style.display = "";
    trSpecExport.style.display = "none";
    tdBttnDoImport.style.display = "";
    var div = document.getElementById("divImportExport");
    div.style.display = "";
    txt.select();
}

function OnImport()
{
    var txt = document.getElementById("txtClipboard");
    var strNumbers = txt.value;
    if (strNumbers.length <= 0)
    {
        alert("请在输入框中输入要导入的数据!");
        return;
    }

    //if (DoImport(strNumbers, false))
        //OnImportExportOK();
}


function OnImportExportOK()
{
    var div = document.getElementById("divImportExport");
    div.style.display = "none";
}
