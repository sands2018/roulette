

function Calc_StatsGroupsCount(stats3C3R, queue)
{
    stats3C3R.Reset(6);

    var nCalcCount = g_bttnStatsGroups.Value();
    var nCount = 0;

    for (var n = queue.nIDX; n >= 0; --n)
    {
        if (queue.anNum[n] == 0)
            continue;

        var numQ = queue.anNum[n];
        var nCol = GetNumCol(numQ);
        var nRow = GetNumRow(numQ);

        stats3C3R.anValue[nCol]++;
        stats3C3R.anValue[nRow + 3]++;

        ++nCount;
        if (nCount >= nCalcCount)
            break;
    }

    stats3C3R.Sort(true);
}

function ChangeTheme(theme)
{
    var csslink = document.getElementById("linkTheme");
    csslink.href = "css/" + theme + ".css";
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

    ChangeTheme((g_status.ThemeID == 0) ? "normal" : "color");

    //Show_3C3R();
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
    var nMin = g_bttnColumns.Value();
    var nColumnCount = g_columns.anStart.length;
    var nCount = 0;

    for (var n = 0; n < nColumnCount; ++n)
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
        if (nCount <= 4)
        {
            tr1.style.display = "none";
            tr2.style.display = "none";
        }
        else if (nCount <= 8)
        {
            tr2.style.display = "none";
        }
    }

    var anActive = [];
    for (var n = 0; n < nCount; ++n)
        anActive[n] = 1;

    for (var n = 0; n < nCount - 1; ++n)
    {
        if (anActive[n] == 0)
            continue;

        if ((g_columns.data.anIdx[n] % 2) != 0)
            continue;

        for (var nn = n + 1; nn < nCount; ++nn)
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

    for (var n = 0; n < 12; ++n)
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

            if (anActive[n] == 1)
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

function Show_FinishedLong()
{
    var MIN_LONG_COUNT = 10;

    var abOccur = [];
    abOccur[0] = [];
    abOccur[1] = [];

    var anCount = [];
    anCount[0] = [];
    anCount[1] = [];

    var anIndex = [];

    for (var n = 0; n < 6; ++n)
    {
        abOccur[0][n] = false;
        abOccur[1][n] = false;
        anCount[0][n] = 0;
        anCount[1][n] = 0;
        anIndex[n] = n;
    }

    var bHaveLong = false;

    for (var n = g_queue.nIDX; n >= 0; --n)
    {
        var anIdx = [];
        anIdx[0] = GetNumCol(g_queue.anNum[n]);
        anIdx[1] = GetNumRow(g_queue.anNum[n]) + 3;

        var bContinue = false;

        for(var n1 = 0; n1 < 2; ++ n1)
        {
            if (abOccur[1][anIdx[n1]])
                continue;

            if (abOccur[0][anIdx[n1]])
            {
                abOccur[1][anIdx[n1]] = true;
                continue;
            }

            abOccur[0][anIdx[n1]] = true;
        }

        for(var nn = 0; nn < 6; ++ nn)
        {
            if ((nn == anIdx[0]) || (nn == anIdx[1]))
                continue;

            if (abOccur[1][nn])
                continue;

            bContinue = true;

            if (abOccur[0][nn])
            {
                anCount[1][nn]++;
                if ((anCount[1][nn]) >= MIN_LONG_COUNT)
                    bHaveLong = true;
            }
            else
            {
                anCount[0][nn]++;
            }
        }

        if (!bContinue)
            break;
    }

    var div = document.getElementById("divFinishedLong");

    var strDisplay = "";
    if (!bHaveLong)
    {
        strDisplay = "none";
    }
    else
    {
        DoSort(anCount[0], anIndex, true);

        var strHtml = "刚结束：&nbsp;&nbsp;";

        for (var n = 0; n < 6; ++n)
        {
            var nIdx = anIndex[n];
            if (anCount[1][nIdx] >= MIN_LONG_COUNT)
            {
                strHtml += GetColRowSpec(nIdx) + "&nbsp;&nbsp;";
                strHtml += "<span class='txtLongCount'>" + anCount[1][nIdx].toString() + "</span>&nbsp;&nbsp;";
                strHtml += anCount[0][nIdx].toString() + ";&nbsp;&nbsp;&nbsp;&nbsp;";
            }
        }

        div.innerHTML = strHtml;
    }

    div.style.display = strDisplay;
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
    var astrIDBttn = ["tdBttnTheme", "tdBttnRestore", "tdBttnImport", "tdBttnManage", "tdBttnStatsGames",
        "tdBttnRestart", "tdBttnExport", "tdBttnSave", "tdBttnStatistics"];

    var abEnabled = [];

    for (var n = 0; n < astrIDBttn.length; ++n)
    {
        abEnabled[n] = true;
    }

    if (g_queue.nIDX < 0)
    {
        abEnabled[4] = false; // stats games
        abEnabled[5] = false; // restart
        abEnabled[6] = false; // export
        abEnabled[7] = false; // save
        abEnabled[8] = false; // statistics
    }
    else
    {
        abEnabled[1] = false; // restore
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
}

function Calc_Sum()
{
    g_columns.ReCalc(g_queue);
}

function Show_AddNum()
{
    Show_Queue();
    Show_3C3R();
    Show_Columns();
    Show_FinishedLong();
    Show_StatsGroupsCount();
    Show_RefreshSysButtons();
    Show_SumLists();
    Show_StatsGames(-1, true);
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



function Show_Keyboard(bShow)
{
    /*
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
    */

    var strIDAnother = "divKeyboard";

    if (g_status.KeyboardID == "K")
        var strIDAnother = "divGameBoard";

    var div = document.getElementById(strIDAnother);
    div.style.display = "none";

    div = document.getElementById("divMainBottom");
    div.style.display = bShow ? "" : "none";;

    var divKB = document.getElementById("divShowKeyboard");
    divKB.style.display = bShow ? "none" : "";
}


function SaveNumbers()
{
    var strNum = NumArrayToString(g_queue);
    WriteData(DATA_NUMBERS, strNum);
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
            strHtml += "&nbsp;&nbsp;";
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
            strHtml += "&nbsp;&nbsp;";
        bFirst = false;

        strHtml += TitleString_StatsGroupsCount(GetColRowSpec(nIdx)) + "&nbsp;";
        strHtml += NumberString_StatsGroupsCount(stats3C3R.anValue[nIdx]);
    }
    tdRow.innerHTML = strHtml;
}

function ResetData(anNum)
{
    PageInit_Data();

    for (var n = 0; n < anNum.length; ++n)
        Calc_AddNum(anNum[n]);

    Calc_Sum();

    Show_AddNum();
}

// bImport - true: import; false: retore
function ResetDataFromNumString(strNum, strAction, AfterResetData)
{
    var strMsgTitle = (strAction == "import") ? "导入数据" : ((strAction == "restore") ? "恢复数据" : "打开数据");
    if ((strNum == undefined) || (strNum == null))
    {
        jAlert("没有找到要导入的数据", strMsgTitle);
        return;
    }

    var rtn = new CReturnArray();
    NumStringToArray(strNum, rtn);

    var strMsg = "";

    if (rtn.rn < 0)
    {
        if (strAction == "import")
            strMsg = "要导入的数据不正确，请检查！";
        else
            strMsg = "保存的数据可能已经损坏";

        jAlert(strMsg, strMsgTitle);
        return;
    }
    else if (rtn.rn == 0)
    {
        if (strAction == "import")
            strMsg = "请在输入框中输入要导入的数据！";
        else
            strMsg = "没有找到保存的数据";

        jAlert(strMsg, strMsgTitle);
        return;
    }

    strMsg = "";
    if (strAction == "import")
    {
        if (g_queue.nIDX >= 0)
            strMsg = "导入将清除当前数据！";
        else
            strMsg = "系统将使用导入的数据，";

        strMsg += "确定要导入吗？"
    }
    else if (strAction == "restore")
    {
        strMsg = "确定要恢复吗？";
    }
    else
    {
        if (g_queue.nIDX >= 0)
            strMsg = "打开将清除当前数据！";
        else
            strMsg = "系统将使用打开的数据，";

        strMsg += "确定要打开吗？"
    }

    jConfirm(strMsg, '请确认', function (rb)
    {
        if (rb)
            ResetData(rtn.anVal);

        if (AfterResetData != null)
            AfterResetData(rb);
    });
}


function Show_SumLists()
{
    var divStatsSum = document.getElementById("divMainStatsSum");
    var divStatsSumLists = document.getElementById("divStatsSumLists");

    if (g_queue.nIDX < 0)
    {
        //divStatsSum.style.display = "none"
        divStatsSumLists.innerHTML = "";
        return;
    }

    // calculate large counts:

    var nNumCount = g_bttnStatsSum.Value();
    var nStart = 0;
    if (nNumCount < (g_queue.nIDX + 1))
        nStart = (g_queue.nIDX + 1) - nNumCount;

    var data3C3R = new CStats3C3R();
    data3C3R.Reset();

    for (var n = nStart; n <= g_queue.nIDX; ++n)
        data3C3R.AddNum(g_queue.anNum[n]);

    g_queue.CalcZeroList(nStart);

    // show:

    var strHtml = "";

    var nTotal = g_queue.nIDX + 1 - nStart;

    strHtml = "<table cellpadding='0' cellspacing='0' id='tblStatsSum'>";
    var bFirst = true;

    var fWidth = 0;
    var strTD = " onclick='OnMainSwitchStats(true)'";

    for (var nn = 0; nn < 3; ++nn)
    {
        strHtml += "<tr>";

        var str = "";
        if (nn == 0)
            str = "<td" + strTD + ">组</td>";
        else if (nn == 1)
            str = "<td" + strTD + ">行</td>";
        else
            str = "<td class='tdTotal'" + strTD + ">" + nTotal.toString() + "</td>";

        strHtml += str;
        strHtml += "<td class='tdStatsSumListItem'>";
        strHtml += "<div id='divStatsSumListItem" + nn.toString();
        strHtml += "' class='divStatsSumListItem' onclick='OnStatsSumListClick(" + nn.toString() + ")'>";
        bFirst = true;
        fWidth = 0;

        for (var n = 0; n < data3C3R.anLargeCount[nn].length; ++n)
        {
            if (data3C3R.anLargeCount[nn][n] > 0)
            {
                if (!bFirst)
                {
                    strHtml += ";&nbsp;";
                    fWidth += 1.5;

                    if (fWidth >= 34)
                    {
                        strHtml += "<br>";
                        fWidth = 0;
                    }
                }

                bFirst = false;

                var strNum = (n + 11).toString();
                fWidth += 2;

                if (n == 19)
                {
                    strNum += "及以上";
                    fWidth += 6;
                }
                strHtml += strNum + "(" + data3C3R.anLargeCount[nn][n].toString() + ")";
                fWidth += ((data3C3R.anLargeCount[nn][n] > 9) ? 3 : 2);
            }
        }
        strHtml += "</div></td></tr>";
    }
    strHtml += "<tr><td class='tdZero'" + strTD + ">" + g_queue.nCountNoZero.toString() + "</td>";
    strHtml += "<td class='tdStatsSumListItem'>";
    strHtml += "<div id='divStatsSumListItem3' class='divStatsSumListItem' onclick='OnStatsSumListClick(3)'>";
    bFirst = true;
    var strNum = "";

    fWidth = 0;
    for (var n = g_queue.anZero.length - 1; n >= 0 ; --n)
    {
        if (!bFirst)
        {
            strHtml += ";&nbsp;";
            fWidth += 1.5;

            if (fWidth >= 44)
            {
                strHtml += "<br>";
                fWidth = 0;
            }
        }

        bFirst = false;
        if (g_queue.anZero[n] == 0)
        {
            strNum = "<span class='txtZero'>0</span>";
            fWidth += 1;
        }
        else
        {
            strNum = g_queue.anZero[n].toString();
            fWidth += ((g_queue.anZero[n] > 99) ? 3 : ((g_queue.anZero[n] > 9) ? 2 : 1));
        }

        strHtml += strNum;
    }
    strHtml += "</div></td></tr>"
    strHtml += "</table>";

    divStatsSumLists.innerHTML = strHtml;
    //divStatsSum.style.display = "";
}


function GetStatsNumTdString(statsNum, nIdx, aStr)
{
    var strNumber = nIdx.toString();
    if (nIdx == 0)
        strNumber = "<span class='txtStatsNumZero'>" + strNumber + "</span>";

    if (nIdx != 37)
    {
        aStr[0] = strNumber;
        aStr[1] = statsNum.anDistance[nIdx];
        aStr[2] = statsNum.anFrequence[nIdx];
    }
    else
    {
        aStr[0] = "平均";
        aStr[1] = Math.round(statsNum.anDistance[nIdx] * 100) / 100;
        aStr[2] = Math.round(statsNum.anFrequence[nIdx] * 100) / 100;
    }
}

function Show_StatsNumbers(nCol)
{
    var nScope = g_bttnStatsScope.Value();

    var stats = new CStatsNumbers(nCol);
    stats.Calc(g_queue, nScope, 0);

    var strHtml = "<table cellpadding='0' cellspacing='1' border='0' style='width: 100%' id='tblStatsNumbers'>";

    strHtml += "<tr>"
    for (var n = 0; n < 2; ++n)
    {
        strHtml += "<td ";

        if (n == 1)
            strHtml += "class='tdStatsNumSecond' ";

        strHtml += "onclick='OnStatsNumClick(0)'>号码</td>";
        strHtml += "<td onclick='OnStatsNumClick(1)'>距离";
        strHtml += stats.SortMark(1);
        strHtml += "</td><td onclick='OnStatsNumClick(2)'>次数";
        strHtml += stats.SortMark(2);
        strHtml += "</td>";
    }
    strHtml += "</tr>"

    var aStr = [];

    for (var n = 0; n <= 18; ++n)
    {
        var nIdx = stats.anIdx[n];
        var nIdxNextCol = stats.anIdx[n + 19];

        GetStatsNumTdString(stats, nIdx, aStr);

        strHtml += "<tr><td class='tdStatsNumber'>" + aStr[0] + "</td>";
        strHtml += "<td>" + aStr[1] + "</td>";
        strHtml += "<td>" + aStr[2] + "</td>";

        GetStatsNumTdString(stats, nIdxNextCol, aStr);

        strHtml += "<td class='tdStatsNumber tdStatsNumSecond'>" + aStr[0] + "</td>";
        strHtml += "<td>" + aStr[1] + "</td>";
        strHtml += "<td>" + aStr[2] + "</td></tr>";
    }

    strHtml += "</table>";

    var div = document.getElementById("divStatsNumbersC");
    div.innerHTML = strHtml;

    var maxdistances = new CNumberMaxDistances();
    maxdistances.Calc(g_queue, nScope, 0);

    strHtml = "";
    var bFirst = true;
    for(var n = 0; n < 5; ++ n)
    {
        if(maxdistances.anMaxNum[n] < 0)
            break;

        if (!bFirst)
            strHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

        var strClass = "tdStatsNumber";
        if (maxdistances.anMaxNum[n] == 0)
            strClass = "txtStatsNumZero";

        strHtml += "<span class='" + strClass + "'>" + maxdistances.anMaxNum[n].toString() + "</span>&nbsp;:&nbsp;";
        strHtml += maxdistances.anMax[n].toString();
        bFirst = false;
    }

    div = document.getElementById("divMaxDistanceTops");
    div.innerHTML = strHtml;
}

function Show_StatsGames(nCol, bMain)
{
    var strDivID = "";
    var strTD = "";
    var strIsMain = "";

    if (bMain)
    {
        strDivID = "divMainStatsGames";
        strTD = " onclick='OnMainSwitchStats(false)'"
        strIsMain = "true";
    }
    else
    {
        strDivID = "divStatsGames";
        strIsMain = "false";
    }



    var divGames = document.getElementById(strDivID);
    if (g_queue.nIDX < 0)
    {
        divGames.innerHTML = "";
        return;
    }

    var nScope = g_bttnStatsScope.Value();

    var games = new CStatsGames(nCol);
    games.Calc(g_queue, nScope, 0);

    var strHtml = "<table cellpadding='0' cellspacing='0' id='tblStatsGames'>";
    strHtml += "<tr><td onclick='OnStatsGamesClick(0, " + strIsMain + ")'>名称</td><td>完成</td>";
    strHtml += "<td onclick='OnStatsGamesClick(1, " + strIsMain + ")'>赢";
    strHtml += games.SortMark(1);
    strHtml += "</td><td>平</td><td>输</td>";
    strHtml += "<td onclick='OnStatsGamesClick(2, " + strIsMain + ")'>结算";
    strHtml += games.SortMark(2);
    strHtml += "</td><td>实时</td></tr>";
    for (var nn = 0; nn < games.aGame.length; ++nn)
    {
        strHtml += "<tr><td" + strTD + ">";
        strHtml += games.aGame[games.anIdx[nn]].strName;
        strHtml += "</td><td>"
        strHtml += games.aGame[games.anIdx[nn]].nCountCompleted.toString();
        strHtml += "</td><td class='tdWon'>"
        strHtml += games.aGame[games.anIdx[nn]].nCountWon.toString();
        strHtml += "</td><td class='tdDrew'>"
        strHtml += games.aGame[games.anIdx[nn]].nCountDrew.toString();
        strHtml += "</td><td class='tdLost'>"
        strHtml += games.aGame[games.anIdx[nn]].nCountLost.toString();
        strHtml += "</td><td>"
        strHtml += games.aGame[games.anIdx[nn]].nBalance.toString();
        strHtml += "</td><td>"
        strHtml += games.aGame[games.anIdx[nn]].nMoney.toString();
        strHtml += "</td></tr>";
    }
    strHtml += "</table><div style=\"height: 220px\">&nbsp;</div>";
    divGames.innerHTML = strHtml;
}


function Show_StatsRounds()
{
    var MAX_COUNT = 20;

    var nTotal = 0;

    var anCount = [];
    var anCountAfter = [];
    var anCountBefore = [];
    var anCountMaxAfter = [];

    for (var nn = 0; nn < 3; ++nn)
    {
        anCount[nn] = [];
        anCountAfter[nn] = [];
        anCountBefore[nn] = [];
        anCountMaxAfter[nn] = 0;
    }

    var an3C3RPrevIdx = [];

    for (var nn = 0; nn < 6; ++nn)
        an3C3RPrevIdx[nn] = -1;

    for (var nn = 0; nn < 3; ++nn)
        for (var n = 0; n < MAX_COUNT; ++n)
            anCount[nn][n] = 0;

    var nScope = g_bttnStatsScope.Value();
    var nStart = g_queue.nIDX - nScope + 1;
    if (nStart < 0) nStart = 0;

    for (var n = nStart; n <= g_queue.nIDX; ++n)
    {
        if (g_queue.anNum[n] == 0)
            continue;

        nTotal++;

        var nCol = GetNumCol(g_queue.anNum[n]);
        var nRow = GetNumRow(g_queue.anNum[n]);

        var nGap = n - an3C3RPrevIdx[nCol] - 1;
        if (nGap < MAX_COUNT)
        {
            anCount[0][nGap]++;
            anCount[2][nGap]++;
        }
        else
        {
            anCountMaxAfter[0]++;
            anCountMaxAfter[2]++;
        }
        an3C3RPrevIdx[nCol] = n;

        nGap = n - an3C3RPrevIdx[nRow + 3] - 1;
        if (nGap < MAX_COUNT)
        {
            anCount[1][nGap]++;
            anCount[2][nGap]++;
        }
        else
        {
            anCountMaxAfter[1]++;
            anCountMaxAfter[2]++;
        }
        an3C3RPrevIdx[nRow + 3] = n;
    }

    for (var nn = 0; nn < 3; ++nn)
    {
        anCountAfter[nn][MAX_COUNT - 1] = anCountMaxAfter[nn];

        for (var n = MAX_COUNT - 2; n >= 0; --n)
            anCountAfter[nn][n] = anCount[nn][n + 1] + anCountAfter[nn][n + 1];

        anCountBefore[nn][0] = 0;

        for (var n = 1; n < MAX_COUNT; ++n)
            anCountBefore[nn][n] = anCount[nn][n - 1] + anCountBefore[nn][n - 1];
    }

    var strHtml = "<table cellpadding='0' cellspacing='0' id='tblStatsRoundSum'>";

    strHtml += "<tr id='trSRSTitle1'><td></td>";
    strHtml += "<td colspan='3' class='tdSRSColumn'>组</td>";
    strHtml += "<td colspan='3' class='tdSRSColumn'>行</td>";
    strHtml += "<td colspan='3'>全部</td>";
    strHtml += "</tr>";

    strHtml += "<tr id='trSRSTitle2'><td>轮次</td>";
    for (var nn = 0; nn < 3; ++nn)
        strHtml += "<td>前</td><td>本轮</td><td class='tdSRSColumn'>后</td>";
    strHtml += "</tr>";

    for (var n = 0; n < MAX_COUNT; ++n)
    {
        strHtml += "<tr>";
        strHtml += "<td class='tdSFTitle'>" + (n + 1).toString() + "</td>";
        for (var nn = 0; nn < 3; ++nn)
        {
            strHtml += "<td>" + anCountBefore[nn][n].toString() + "</td>";
            strHtml += "<td>" + anCount[nn][n].toString() + "</td>";
            strHtml += "<td class='tdSRSColumn'>" + anCountAfter[nn][n].toString() + "</td>";
        }
        strHtml += "</tr>";
    }
    strHtml += "</table>";

    var div = document.getElementById("divStatsRounds");
    div.innerHTML = strHtml;
}

function Show_StatsRoundBet()
{
    var strHtml = "";

    var nScope = g_bttnStatsScope.Value();
    var nBefore = 0;

    var data3C3R = new CStats3C3R();
    data3C3R.Reset();

    var nMaxIdx = g_queue.nIDX - nBefore;
    var nMinIdx = g_queue.nIDX - nBefore - nScope + 1;

    if (nMaxIdx >= 0)
    {
        var stats = new CStatsRoundBet();

        if (nMinIdx < 0)
            nMinIdx = 0;

        for (n = nMinIdx; n <= nMaxIdx; ++n)
        {
            data3C3R.AddNum(g_queue.anNum[n]);
            stats.AddNum(g_queue.anNum[n], data3C3R);
        }

        strHtml = "<table cellpadding='0' cellspacing='0' id='tblStatsRoundBet'>";
        strHtml += "<tr onclick='OnShowStatsMisc()'><td>轮次</td><td>不出</td><td>概率</td>";
        for (var nn = 0; nn < stats.anFailedRound.length; ++nn)
        {
            strHtml += "<td>F" + stats.anFailedRound[nn].toString() + "</td><td>概率</td>";
        }
        strHtml += "</tr>";

        var nTotal = nMaxIdx - nMinIdx + 1;

        for (var n = 0; n < stats.anRound.length; ++n)
        {
            strHtml += "<tr id='trStatsIntv" + n.toString() + "' onclick='OnStatsIntervalClick(true)'><td>" + stats.anRound[n].toString() + "</td>";
            strHtml += "<td>" + stats.anNotYetCount[n].toString() + "</td>";

            var percent1 = stats.anNotYetCount[n] * 100 / nTotal;
            strHtml += "<td>" + percent1.toFixed(1) + "%</td>";


            for (var nn = 0; nn < stats.anFailedRound.length; ++nn)
            {
                strHtml += "<td>" + stats.anFailed[nn][n].toString() + "</td>";

                var percent2 = 0;
                if (stats.anNotYetCount[n] > 0)
                    percent2 = stats.anFailed[nn][n] * 100 / stats.anNotYetCount[n];
                strHtml += "<td>" + percent2.toFixed(1) + "%</td>";
            }

            strHtml += "</tr>";
        }
        strHtml += "</table>";
    }

    var div = document.getElementById("divStatsRoundBetC");
    div.innerHTML = strHtml;
}

function Show_StatsLongs()
{
    var nBetCount = g_bttnStatsLongsBet.Value();
    var nRound = g_bttnStatsLongs.Value();

    var data3C3R = new CStats3C3R();
    data3C3R.Reset();

    var nTotalCount = 0;
    var anOccurCount = [0, 0, 0, 0, 0, 0];
    var nNotOccurCount = 0;

    var aLongs = [];
    for (var nn = 0; nn < 6; ++nn)
        aLongs[nn] = new CStatsLongItem();

    for (var n = 0; n <= g_queue.nIDX; ++n)
    {
        var num = g_queue.anNum[n];

        if (num == 0)
            continue;

        var nCol = GetNumCol(num);
        var nRow = GetNumRow(num);

        for(var nn = 0; nn < 6; ++ nn)
        {
            if (aLongs[nn].bActive)
            {
                if ((nn == nCol) || (nn == (nRow + 3)))
                {
                    anOccurCount[aLongs[nn].nRoundAfter]++
                    aLongs[nn].Reset();
                    break;
                }

                aLongs[nn].nRoundAfter++;

                if (aLongs[nn].nRoundAfter >= nBetCount)
                {
                    nNotOccurCount++;
                    aLongs[nn].Reset();
                    break;
                }
            }
            else
            {
                if (data3C3R.data.anValue[nn] >= nRound)
                {
                    if ((nn == nCol) || (nn == (nRow + 3)))
                    {
                        aLongs[nn].nRoundBefore = data3C3R.data.anValue[nn]; // not used currently
                        aLongs[nn].bActive = true;
                        ++nTotalCount;
                    }
                }
            }
        }

        data3C3R.AddNum(num);
    }

    var strHtml = "<table cellpadding='0' cellspacing='0' style='width: 100%' id='tblStatsLongs'>";

    strHtml += "<tr><td>次数</td>";
    for (var n = 0; n < nBetCount; ++n)
        strHtml += "<td>" + (n + 1).toString() + "</td>";
    strHtml += "<td>NOT</td></tr>";

    strHtml += "<tr><td id='tdSLT' rowspan='2'>" + nTotalCount.toString() + "</td>";
    for (var n = 0; n < nBetCount; ++n)
        strHtml += "<td>" + anOccurCount[n].toString() + "</td>";
    strHtml += "<td>" + nNotOccurCount.toString() + "</td></tr>";

    strHtml += "<tr>";

    var strPercent;

    for (var n = 0; n < nBetCount; ++n)
    {
        if (nTotalCount > 0)
            strPercent = (anOccurCount[n] * 100 / nTotalCount).toFixed(1).toString();
        else
            strPercent = "0";

        strHtml += "<td>" + strPercent + "%</td>";
    }

    if (nTotalCount > 0)
        strPercent = (nNotOccurCount * 100 / nTotalCount).toFixed(1).toString();
    else
        strPercent = "0";

    strHtml += "<td>" + strPercent + "%</td></tr>";

    strHtml += "</table>";

    var div = document.getElementById("divStatsLongsC");
    div.innerHTML = strHtml;
}

function Show_StatsMisc()
{
    Show_StatsRoundBet();
    Show_StatsLongs();
}


function SetFilesTitle(strTitle)
{
    var td = document.getElementById("tdFilesTitle");
    td.innerHTML = strTitle;
}

function UpdateFilesButtonStatus(nSelCount)
{
    var astrIDBttn = ["tdBttnFileOpen", "tdBttnFileRename", "tdBttnFileDelete", "tdBttnFileExit"];
    var abEnabled = [true, true, true, true];

    if (nSelCount == 0)
    {
        abEnabled[0] = false;
        abEnabled[1] = false;
        abEnabled[2] = false;
    }
    else if (nSelCount > 1)
    {
        abEnabled[0] = false;
        abEnabled[1] = false;
        abEnabled[2] = true;
    }

    for (var n = 0; n < astrIDBttn.length; ++n)
    {
        var bttn = document.getElementById(astrIDBttn[n]);
        bttn.className = abEnabled[n] ? "tdSBEnabled" : "tdSBDisabled";
    }
}

function OpenFilesDialog()
{
    SetFilesTitle("保存的数据");
    SwitchWindow("divMain", "divFiles");

    var div = document.getElementById("divFilesTop");
    var n1 = div.offsetHeight;
    div = document.getElementById("divFilesBottom");
    var n2 = div.offsetTop;

    div = document.getElementById("divFilesMain");
    div.style.top = n1 + 1;
    div.style.height = n2 - n1 - 1;

    UpdateFilesButtonStatus(0);

    g_files.Load();

    $(function ()
    {
        $('#dgFiles').datagrid({
            data: g_files.fs,
            singleSelect: false,
            remoteSort: false,
            sortName: 'n',
            sortOrder: 'desc',
            onClickRow: function (nIdxRow)
            {
                var rows = $('#dgFiles').datagrid('getSelections');
                UpdateFilesButtonStatus(rows.length);
            }
        });
    });
}

function SwitchWindow(strHideDivID, strShowDivID)
{
    var div = document.getElementById(strHideDivID);
    div.style.display = "none";

    div = document.getElementById(strShowDivID);
    div.style.display = "";
}


function OnImportOK()
{
    var div = document.getElementById("divImport");
    div.style.display = "none";
}

function OnHideFiles()
{
    SwitchWindow("divFiles", "divMain");
}

function FormatTimeCol(value, row, index)
{
    var tm = new Date(value);
    return tm.format("yyyy-MM-dd HH:mm");
}

function AfterSaveFile(strFileName, rn)
{
    var rb = true;
    var strMsg = "";
    var strTitle = "";
    if (rn > 0)
    {
        strTitle = "保存成功";
        strMsg = "保存\"" + strFileName + "\"成功";
    }
    else
    {
        strTitle = "保存失败";
        strMsg = g_files.ErrorMessage(rn);
        rb = false;
    }
    jAlert(strMsg, strTitle);

    return rb;
}

function AfterImportData(rb)
{
    if (rb)
    {
        SaveNumbers();
        OnImportOK();
    }
}


function AfterOpenData(rb)
{
    if (rb)
    {
        SaveNumbers();
        OnHideFiles();
    }
}

