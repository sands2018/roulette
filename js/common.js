var g_nDebug = 0;

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

// global variables: ------------------------------------------------

var QUEUE_MAX_COUNT = 100;
var QUEUE_LINE_NUM_COUNT = 15;

// ------------------------------------------------------------------

function WriteData(key, value)
{
    if (!window.localStorage)
        return;

    var storage = window.localStorage;
    storage[key] = value;
}

function ReadData(key, strDefault)
{
    if (!window.localStorage)
        return strDefault;

    var storage = window.localStorage;
    var strValue = storage[key];
    if (!strValue || (strValue == ""))
        strValue = strDefault;
    return strValue;
}

function DoSort(anValue, anIdx, bAsend)
{
    var nCount = anValue.length;

    var bChanged = false;
    do
    {
        bChanged = false;

        for (var n = 0; n < nCount - 1; ++n)
        {
            if ((bAsend && (anValue[anIdx[n]] > anValue[anIdx[n + 1]]))
                || (!bAsend && (anValue[anIdx[n]] < anValue[anIdx[n + 1]])))
            {
                tmp = anIdx[n];
                anIdx[n] = anIdx[n + 1];
                anIdx[n + 1] = tmp;

                bChanged = true;
            }
        }
    } while (bChanged);
}

function SwitchTrueFalse(strValue)
{
    var str = "F";
    if (strValue == "F")
        str = "T";

    return str;
}

// ------------------------------------------------------------------------

function GetNumCol(num)
{
    return Math.floor((num - 1) / 12);
}

function GetNumRow(num)
{
    var nRow = num % 3;
    if (nRow == 1)
    {
        nRow = 2;
    }
    else if (nRow == 2)
    {
        nRow = 1;
    }

    return nRow;
}

function GetNumColumn(num)
{
    var anCol = [];

    anCol[0] = Math.floor((num - 1) / 6) * 2;

    if ((num > 3) && (num < 34))
        anCol[1] = Math.floor((num - 4) / 6) * 2 + 1;
    else
        anCol[1] = -1;

    return anCol;
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

// ------------------------------------------------------------------------

function CIndexedArray()
{
    this.anValue = [];
    this.anIdx = [];

    this.Sort = function (bAsend)
    {
        DoSort(this.anValue, this.anIdx, bAsend);
    }

    this.Value = function (idx)
    {
        return this.anValue[this.anIdx[idx]];
    }

    this.Reset = function(nCount)
    {
        for (var n = 0; n < nCount; ++n)
        {
            this.anValue[n] = 0;
            this.anIdx[n] = n;
        }
    }
}

// nBttdnWidth: <0 not set; 0 full size; >0 button width;
function CBttnOptions(strName, anValue, astrTitle, nSelIdx, nBttnWidth)
{
    this.DATA_KEY = "BTTNS_" + strName + "_IDX";
    this.strName = strName;
    this.nBttnWidth = nBttnWidth;
    this.nCount = anValue.length;

    var strVal = ReadData(this.DATA_KEY, nSelIdx.toString());
    var nVal = parseInt(strVal);
    if ((nVal < 0) || (nVal >= this.nCount))
        nVal = 0;
    this.nSelIdx = nVal;

    this.anValue = [];
    this.astrTitle = [];

    for(var n = 0; n < this.nCount; ++ n)
    {
        if (anValue[n] < 0)
            this.anValue[n] = 999999;
        else
            this.anValue[n] = anValue[n];

        if (astrTitle != null)
        {
            this.astrTitle[n] = astrTitle[n];
        }
        else
        {
            if (anValue[n] < 0)
                this.astrTitle[n] = "全部";
            else
                this.astrTitle[n] = anValue[n].toString();
        }
    }

    this.Value = function()
    {
        return this.anValue[this.nSelIdx];
    }

    this.Title = function()
    {
        return this.astrTitle[this.nSelIdx];
    }

    this.OnClick = function(nIdx)
    {
        if(this.nSelIdx == nIdx)
            return;
        
        this.nSelIdx = nIdx;

        for(var n = 0; n < this.nCount; ++ n)
        {
            var td = document.getElementById("tdBttn" + this.strName + n.toString());

            if(n == nIdx)
                td.className = "tdBttn tdSelBttn";
            else
                td.className = "tdBttn";
        }

        WriteData(this.DATA_KEY, nIdx);
    }

    this.Show = function(strContainerID)
    {
        var strStyle = "";
        if (this.nBttnWidth == 0)
            strStyle = "style='width: 100%' ";

        var strHtml = "<table cellpadding='0' cellspacing='10' border='0' " + strStyle + "id='tblBttn" + this.strName + "'><tr>";
        for (var n = 0; n < this.nCount; ++n)
        {
            var strClass = "tdBttn";
            if (n == this.nSelIdx)
                strClass += " tdSelBttn";

            strHtml += "<td id='tdBttn" + this.strName + n.toString() + "' ";
            if(this.nBttnWidth > 0)
                strHtml += "style='width: " + this.nBttnWidth.toString() + "px' ";
            strHtml += "class='" + strClass + "' ";
            strHtml += "onclick='OnBttn" + this.strName + "Click(" + n.toString() + ")'";
            strHtml += ">" + this.astrTitle[n] + "</td>";
        }

        strHtml += "</tr></table>";

        var div = document.getElementById(strContainerID);
        div.innerHTML = strHtml;
    }
}

var DATA_NUMBERS = "NUMBERS";
var DATA_KEYBOARDID = "KEYBOARDID";
var DATA_SEPERATE3C3R = "SEPERATE3C3R";
var DATA_COLUMNSBUTTON = "COLUMNSBUTTON";
var DATA_SGCOUNTIDX = "SGCOUNTIDX";

function CSysStatus()
{
    this.ThemeID = 0;
    this.Escape = 0;
    this.KeyboardID = "K";
    this.Seperate3C3R = "F";
    this.QueueExpand = 0;
    this.anStatsSumExpand = [0, 0, 0, 0];

    this.Reset = function()
    {
        this.QueueExpand = 0;
        this.KeyboardID = ReadData(DATA_KEYBOARDID, "K");
        this.Seperate3C3R = ReadData(DATA_SEPERATE3C3R, "F");

        for (var n = 0; n < 4; ++n)
            this.anStatsSumExpand[n] = 0;
    }
}

function CNumQueue()
{
    var MAX_NUM_COUNT = 10000;

    this.anNum = [];
    this.nIDX = -1;
    this.nCountNoZero = 0;
    this.anZero = []; // 需要显示的时候才计算

    this.AddNum = function(nNum)
    {
        if (this.nIDX == (MAX_NUM_COUNT - 1))
        {
            for (var n = 0; n <= this.nIDX - 1; ++n)
            {
                this.anNum[n] = this.anNum[n + 1];
            }
        }
        else
        {
            this.nIDX++;
        }

        this.anNum[this.nIDX] = nNum;
    }

    this.Reset = function()
    {
        if (this.anNum.length > 0)
            this.anNum.splice(0, this.anNum.length);

        this.nIDX = -1;
        this.nCountNoZero = 0;
    }

    this.CalcZeroList = function(nStart)
    {
        this.nCountNoZero = 0;

        if (this.anZero.length > 0)
            this.anZero.splice(0, this.anZero.length);

        for (var n = nStart; n <= this.nIDX; ++n)
        {
            if (this.anNum[n] == 0)
            {
                this.anZero.push(0);
            }
            else
            {
                this.nCountNoZero++;

                var nLen = this.anZero.length;
                if(nLen == 0)
                {
                    this.anZero.push(1);
                }
                else
                {
                    if (this.anZero[nLen - 1] == 0)
                        this.anZero.push(1);
                    else
                        this.anZero[nLen - 1]++;
                }
            }
        }
    }
}

function NumArrayToString(queue)
{
    var strExport = "";
    var bFirst = true;
    for (var n = 0; n <= queue.nIDX; ++n)
    {
        if (!bFirst)
            strExport += ",";
        bFirst = false;

        strExport += queue.anNum[n].toString();
    }

    return strExport;
}

function CReturnArray()
{
    this.anVal = [];
    this.rn = 0;
}

function NumStringToArray(strNumbers, rtn)
{
    var astrNum = strNumbers.split(",");
    if ((strNumbers.length <= 0) || (astrNum.length <= 0))
    {
        rtn.rn = 0;
        return;
    }

    var anNum = [];
    for (var n = 0; n < astrNum.length; ++n)
    {
        var nNum = parseInt(astrNum[n]);
        if (isNaN(nNum) || (nNum < 0) || (nNum > 36))
        {
            rtn.rn = -1;
            return;
        }

        rtn.anVal[n] = nNum;
    }

    rtn.rn = 1;
}

function CStats3C3R()
{
    this.data = new CIndexedArray();

    var LARGE_COUNT_NUM = 20;
    this.anLargeCount = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

    this.anLargeCountCol = [];
    this.anLargeCountRow = [];

    this.Reset = function ()
    {
        this.data.Reset(6);

        for (var nn = 0; nn < 3; ++nn)
            for (var n = 0; n < LARGE_COUNT_NUM; ++n)
                this.anLargeCount[nn][n] = 0;
    }

    this.AddNum = function (num)
    {
        if (num == 0) return;

        for (var n = 0; n < 6; ++n)
            this.data.anValue[n]++;

        var nCol = GetNumCol(num);
        var nRow = GetNumRow(num);

        // process g_StatsInterval.anLargeCount: ----------

        var anNum3C3R = [nCol, nRow + 3];

        for (var n = 0; n < 2; ++n)
        {
            var nCount = this.data.anValue[anNum3C3R[n]] - 1;

            if (nCount >= 11)
            {
                var nIdx = nCount - 11;
                if (nIdx >= (LARGE_COUNT_NUM - 1))
                    nIdx == LARGE_COUNT_NUM - 1;

                this.anLargeCount[2][nIdx]++; // total
                this.anLargeCount[n][nIdx]++; // col or row
            }

            this.data.anValue[anNum3C3R[n]] = 0;
        }
    }
}

function CStatsColumns()
{
    this.anStart = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31];

    this.data = new CIndexedArray();

    this.Reset = function ()
    {
        this.data.Reset(this.anStart.length);
    }

    // call this function when num queue changed:

    this.ReCalc = function (queue)
    {
        var nColumnCount = this.anStart.length;

        var anCounting = [];

        for (var nn = 0; nn < nColumnCount; ++nn)
            anCounting[nn] = 1;

        this.Reset();

        if (queue.nIDX < 0)
            return;

        for (var n = queue.nIDX; n >= 0; --n)
        {
            var bChanged = false;

            if (queue.anNum[n] == 0)
                continue;

            var anColumn = GetNumColumn(queue.anNum[n]);

            for (var nn = 0; nn < nColumnCount; ++nn)
            {
                if ((nn == anColumn[0]) || (nn == anColumn[1]))
                {
                    anCounting[nn] = 0;
                }
                else
                {
                    if (anCounting[nn] != 0)
                    {
                        this.data.anValue[nn]++;
                        bChanged = true;
                    }
                }
            }

            if (!bChanged)
                break;
        }

        this.data.Sort(false);
    }
}


function CStatsView(nSortColCount, nCol, dataKey)
{
    var nColRead = 0;
    var strVal = ReadData(dataKey, "");

    this.nColSel = nCol;
    this.anSort = [];

    var bValid = false;

    if (strVal.length >= (nSortColCount * 2 + 1))
    {
        var astrVal = strVal.split(",");
        if (astrVal.length == (nSortColCount + 1))
        {
            bValid = true;

            for (var n = 0; n < (nSortColCount + 1); ++n)
            {
                var nVal = parseInt(astrVal[n]);
                if (n == 0)
                {
                    if ((nVal >= 0) && (nVal < nSortColCount))
                    {
                        nColRead = nVal;
                    }
                    else
                    {
                        bValid = false;
                        break;
                    }
                }
                else
                {
                    if ((nVal == 0) || (nVal == 1))
                    {
                        this.anSort[n - 1] = nVal;
                    }
                    else
                    {
                        bValid = false;
                        break;
                    }
                }
            }
        }
    }

    var bWrite = false;

    if (bValid)
    {
        if (this.nColSel > 0)
        {
            if (this.nColSel == nColRead)
            {
                this.anSort[this.nColSel] = (this.anSort[this.nColSel] + 1) % 2;
                bWrite = true;
            }
        }

        if (this.nColSel >= 0)
        {
            if (this.nColSel != nColRead)
                bWrite = true;
        }
        else
        {
            this.nColSel = nColRead;
        }
    }
    else
    {
        for (var n = 0; n < nSortColCount; ++ n)
            this.anSort[n] = 1;

        if (this.nColSel >= 0)
        {
            if (this.nColSel > 0)
                this.anSort[this.nColSel] = 0;

            bWrite = true;
        }
        else
        {
            this.nColSel = 1;
        }
    }

    if (bWrite)
    {
        strVal = this.nColSel.toString();

        for (var n = 0; n < nSortColCount; ++n)
            strVal += "," + this.anSort[n].toString();

        WriteData(dataKey, strVal);
    }

    this.SortMark = function(nCol)
    {
        var str = "";
        if (this.nColSel == nCol)
        {
            if (this.anSort[nCol] == 0)
                str = "&nbsp;&#8593;";
            else
                str = "&nbsp;&#8595;";
        }
        return str;
    }
}

function CStatsNumbers(nCol)
{
    var DATA_STATSNUM_COL = "STATSNUM_COL";

    CStatsView.call(this, 3, nCol, DATA_STATSNUM_COL);

    this.anDistance = [];
    this.anFrequence = [];
    this.anIdx = [];

    this.Calc = function (queue, nScope, nBefore)
    {
        var abStop = [];

        for (var n = 0; n <= (36 + 1) ; ++n)
        {
            this.anDistance[n] = 0;
            this.anFrequence[n] = 0;
            this.anIdx[n] = n;

            abStop[n] = false;
        }

        // calc Distance: -----------------------
        // distance is always from most recent num (that is, nBefore is useless for distance calcuiation)

        var nMaxIdx = queue.nIDX;
        var nMinIdx = queue.nIDX - nScope + 1;

        if (nMaxIdx >= 0)
        {
            if (nMinIdx < 0)
                nMinIdx = 0;

            for (var nn = nMaxIdx; nn >= nMinIdx ; --nn)
            {
                var bChanged = false;

                for (var n = 0; n <= 36; ++n)
                {
                    if (!abStop[n])
                    {
                        if (queue.anNum[nn] == n)
                        {
                            abStop[n] = true;
                        }
                        else
                        {
                            ++this.anDistance[n];
                            bChanged = true;
                        }
                    }
                }

                if (!bChanged)
                    break;
            }
        }

        // calc Frequence: ----------------------

        nMaxIdx = queue.nIDX - nBefore;
        nMinIdx = queue.nIDX - nBefore - nScope + 1;

        if (nMaxIdx >= 0)
        {
            if (nMinIdx < 0)
                nMinIdx = 0;

            for (var nn = nMaxIdx; nn >= nMinIdx ; --nn)
                this.anFrequence[queue.anNum[nn]]++;
        }

        // calc average: ------------------------

        var nTotalDistance = 0;
        var nTotalFrequence = 0;

        for (var n = 0; n <= 36; ++n)
        {
            nTotalDistance += this.anDistance[n];
            nTotalFrequence += this.anFrequence[n];
        }

        if (nTotalDistance == 0)
            this.anDistance[37] = 0;
        else
            this.anDistance[37] = nTotalDistance / 37;

        if (nTotalFrequence == 0)
            this.anFrequence[37] = 0;
        else
            this.anFrequence[37] = nTotalFrequence / 37;

        // sort: --------------------------------

        if (this.nColSel == 1)
        {
            DoSort(this.anDistance, this.anIdx, (this.anSort[1] == 0));
        }
        else if (this.nColSel == 2)
        {
            DoSort(this.anFrequence, this.anIdx, (this.anSort[2] == 0));
        }
    }
}


function CGameItem()
{
    this.nIdx = 1;
    this.nBet3C3R = -1; // 0 ~ 2: columns; 3 ~ 5: rows
    this.nDistance = 0;
    this.nRound = 0;
    this.nMoney = 0;
    this.nStatus = 1;
    this.nHit = 0;
}

// nACR: 0 - all; 1 - column; 2 - row
function CGame(nAfter, anBet, nACR)
{
    this.nAfter = nAfter;
    this.nRound = anBet.length;
    this.nACR = nACR;

    this.anBet = [];
    var strName = nAfter.toString() + "_";
    for (var n = 0; n < anBet.length; ++n)
    {
        this.anBet[n] = anBet[n] * 10;
        strName += anBet[n].toString();
    }

    if (nACR == 0)
        strName = "全_" + strName;
    else if (nACR == 1)
        strName = "组_" + strName;
    else if (nACR == 2)
        strName = "行_" + strName;

    this.strName = strName;

    this.nCount = 0;
    this.nMoney = 0;

    this.nCountCompleted = 0;
    this.nCountWon = 0;
    this.nCountDrew = 0;
    this.nCountLost = 0;
    this.nCountHit = 0;

    this.nBalance = 0;

    this.aItem = [];

    this.Add = function (item)
    {
        this.aItem[this.nCount] = item;
        this.aItem[this.nCount].nIdx = this.nCount;
        this.nCount++;
    }

    this.AfterItemEnds = function (item)
    {
        this.nCountCompleted++;

        if (item.nMoney > 0)
            this.nCountWon++;
        else if (item.nMoney == 0)
            this.nCountDrew++;
        else
            this.nCountLost++;

        if (item.nHit == 1)
            this.nCountHit++;

        this.nBalance += item.nMoney;
    }

    this.AddNum = function (num, data3C3R)
    {
        // add distance for all item:

        for (var n = 0; n < this.nCount; ++n)
        {
            this.aItem[n].nDistance++;
        }

        // number 0:

        if (num == 0)
        {
            this.nMoney = this.nBalance;
            for (var n = 0; n < this.nCount; ++n)
            {
                if (this.aItem[n].nStatus == 0)
                    continue;

                this.aItem[n].nMoney -= this.anBet[this.aItem[n].nRound - 1];
                this.nMoney += this.aItem[n].nMoney;
            }

            return;
        }

        var nNumCol = GetNumCol(num);
        var nNumRow = GetNumRow(num);

        var anNum3C3R = [];

        if (this.nACR == 0)
            anNum3C3R = [nNumCol, nNumRow + 3];
        else if (this.nACR == 1)
            anNum3C3R = [nNumCol];
        else
            anNum3C3R = [nNumRow + 3];

        // whether hitted by column or row:

        for (var nn = 0; nn < anNum3C3R.length; ++nn)
        {
            for (var n = 0; n < this.nCount; ++n)
            {
                if (this.aItem[n].nStatus == 0)
                    continue;

                if (this.aItem[n].nBet3C3R == anNum3C3R[nn])
                {
                    this.aItem[n].nMoney += (this.anBet[this.aItem[n].nRound - 1] * 3);
                    this.aItem[n].nStatus = 0;
                    this.aItem[n].nHit = 1;

                    this.AfterItemEnds(this.aItem[n]);
                }
            }
        }

        // increase round, see if it ends:

        for (var n = 0; n < this.nCount; ++n)
        {
            if (this.aItem[n].nStatus == 0)
                continue;

            if (this.aItem[n].nRound == this.anBet.length)
            {
                this.aItem[n].nStatus = 0;
                this.aItem[n].nHit = 0;

                this.AfterItemEnds(this.aItem[n]);
            }
            else
            {
                this.aItem[n].nRound++;
                this.aItem[n].nMoney -= this.anBet[this.aItem[n].nRound - 1];
            }
        }

        // whether a new game start:

        var nStart = 0;
        var nEnd = 5;
        if (this.nACR == 1)
            nEnd = 2;
        else if (this.nACR == 2)
            nStart = 3;

        for (var n = nStart; n <= nEnd; ++n)
        {
            if (data3C3R.data.Value(n) == this.nAfter)
            {
                var item = new CGameItem();
                item.nBet3C3R = n;
                item.nDistance = 0;
                item.nRound = 1;
                item.nMoney = -this.anBet[0];
                item.nStatus = 1;

                this.Add(item);
            }
        }

        // calculate realtime money:

        this.nMoney = this.nBalance;
        for (var n = 0; n < this.nCount; ++n)
        {
            if (this.aItem[n].nStatus == 0)
                continue;

            this.nMoney += this.aItem[n].nMoney;
        }
    }
}

function CStatsGames(nCol)
{
    var DATA_STATSGAMES_COL = "STATSGAMES_COL";

    CStatsView.call(this, 3, nCol, DATA_STATSGAMES_COL);

    this.aGame = [];
    this.anIdx = [];

    for (var n = 0; n < 3; ++n)
    {
        this.aGame[0 * 3 + n] = new CGame(3, [1, 2, 4], n);
        this.aGame[1 * 3 + n] = new CGame(4, [1, 2, 4], n);
        this.aGame[2 * 3 + n] = new CGame(5, [1, 2, 4], n);
        this.aGame[3 * 3 + n] = new CGame(6, [1, 2, 4], n);
        this.aGame[4 * 3 + n] = new CGame(5, [1, 2, 4, 8], n);
        this.aGame[5 * 3 + n] = new CGame(6, [1, 2, 4, 8], n);
        this.aGame[6 * 3 + n] = new CGame(7, [1, 2, 4, 8], n);
        this.aGame[7 * 3 + n] = new CGame(8, [1, 2, 4, 8], n);
        this.aGame[8 * 3 + n] = new CGame(5, [2, 3, 4, 6], n);
        this.aGame[9 * 3 + n] = new CGame(6, [2, 3, 4, 6], n);
        this.aGame[10 * 3 + n] = new CGame(6, [1, 2, 3, 4], n);
        this.aGame[11 * 3 + n] = new CGame(7, [1, 2, 3, 4], n);
        this.aGame[12 * 3 + n] = new CGame(5, [1, 2, 3, 5], n);
        this.aGame[13 * 3 + n] = new CGame(6, [1, 2, 3, 5], n);
        this.aGame[14 * 3 + n] = new CGame(6, [1, 2, 3, 4, 5], n);
        this.aGame[15 * 3 + n] = new CGame(7, [1, 2, 3, 4, 5], n);
        this.aGame[16 * 3 + n] = new CGame(5, [1, 1, 1, 2, 2, 3], n);
        this.aGame[17 * 3 + n] = new CGame(6, [1, 1, 1, 2, 2, 3], n);
    }

    this.Calc = function (queue, nScope, nBefore)
    {
        var anIdx = [];

        for (var n = 0; n < this.aGame.length; ++n)
            this.anIdx[n] = n;

        var data3C3R = new CStats3C3R();
        data3C3R.Reset();

        var nMaxIdx = queue.nIDX - nBefore;
        var nMinIdx = queue.nIDX - nBefore - nScope + 1;

        if (nMaxIdx >= 0)
        {
            if (nMinIdx < 0)
                nMinIdx = 0;

            for (n = nMinIdx; n <= nMaxIdx; ++n)
            {
                data3C3R.AddNum(queue.anNum[n]);

                for (var nn = 0; nn < this.aGame.length; ++nn)
                    this.aGame[nn].AddNum(queue.anNum[n], data3C3R);
            }
        }

        // sort: --------------------------------

        if (this.nColSel == 1) // win percentage
        {
            var anValue = [];
            for (var n = 0; n < this.aGame.length; ++n)
                anValue[n] = this.aGame[n].nBalance;

            DoSort(anValue, this.anIdx, (this.anSort[1] == 0));

            var afValue = [];
            for (var n = 0; n < this.aGame.length; ++n)
            {
                if (this.aGame[n].nCountCompleted <= 0)
                    afValue[n] = 0;
                else
                    afValue[n] = this.aGame[n].nCountWon * 1.0 / this.aGame[n].nCountCompleted;
            }

            DoSort(afValue, this.anIdx, (this.anSort[1] == 0));
        }
        else if (this.nColSel == 2) // balance
        {
            var anValue = [];
            for (var n = 0; n < this.aGame.length; ++n)
                anValue[n] = this.aGame[n].nBalance;

            DoSort(anValue, this.anIdx, (this.anSort[2] == 0));
        }
    }
}

function CStatsRoundBet()
{
    this.anRound = [3, 4, 5, 6, 7, 8, 9];

    this.anFailedRound = [4, 6];
    this.anFailed = [];
    this.anFailed[0] = [0, 0, 0, 0, 0, 0, 0];
    this.anFailed[1] = [0, 0, 0, 0, 0, 0, 0];
    this.anNotYetCount = [0, 0, 0, 0, 0, 0, 0];

    this.AddNum = function (num, data3C3R)
    {
        // 0:
        if (num == 0)
        {
            return;
        }

        var nCount = this.anRound.length;

        for (var nn = 0; nn < 6; ++nn)
        {
            // whether hit start:

            for (var n = 0; n < nCount; ++n)
            {
                if (data3C3R.data.anValue[nn] == this.anRound[n])
                {
                    this.anNotYetCount[n]++;
                }
            }

            // whether hit end:

            for (var n = 0; n < nCount; ++n)
            {
                var nRound = this.anFailedRound.length;

                for (var r = 0; r < nRound; ++r)
                {
                    if ((data3C3R.data.anValue[nn] == (this.anRound[n] + this.anFailedRound[r])))
                    {
                        this.anFailed[r][n]++;
                    }
                }
            }
        }
    }
}


function CStatsRoundSum()
{
    this.Show = function (queue, strDiv)
    {
        var MAX_COUNT = 30;

        var anCount = [];
        var anCountAbove = [];
        var nCount30Above = 0;
        var nTotal = 0;

        var an3C3RPrevIdx = [];

        for (var nn = 0; nn < 6; ++nn)
            an3C3RPrevIdx[nn] = -1;

        for (var nn = 0; nn < MAX_COUNT; ++nn)
            anCount[nn] = 0;

        for (var n = 0; n <= queue.nIDX; ++n)
        {
            if (queue.anNum[n] == 0)
                continue;

            nTotal++;

            var nCol = GetNumCol(queue.anNum[n]);
            var nRow = GetNumRow(queue.anNum[n]);

            var nGap = n - an3C3RPrevIdx[nCol] - 1;
            if (nGap < MAX_COUNT)
                anCount[nGap]++;
            else
                nCount30Above++;

            an3C3RPrevIdx[nCol] = n;

            nGap = n - an3C3RPrevIdx[nRow + 3] - 1;
            if (nGap < MAX_COUNT)
                anCount[nGap]++;
            else
                nCount30Above++;
            an3C3RPrevIdx[nRow + 3] = n;
        }

        anCountAbove[MAX_COUNT - 1] = anCount[MAX_COUNT - 1] + nCount30Above;

        for (var n = MAX_COUNT - 2; n >= 0; --n)
            anCountAbove[n] = anCount[n] + anCountAbove[n + 1];

        var BIG_COL_COUNT = 2;
        var EACH_COL_COUNT = MAX_COUNT / BIG_COL_COUNT;

        strHtml += "<table cellpadding='0' cellspacing='0' id='tblStatsFinally'><tr>";
        for (var n = 0; n < MAX_COUNT; ++n)
        {
            if ((n != 0) && ((n % BIG_COL_COUNT) == 0))
                strHtml += "</tr><tr>";

            var nIdx = EACH_COL_COUNT * (n % BIG_COL_COUNT) + Math.floor(n / BIG_COL_COUNT);

            strHtml += "<td class='tdSFTitle'>" + (nIdx + 1).toString() + ((nIdx == (MAX_COUNT - 1)) ? "+" : "") + "</td>";

            var nCount = anCount[nIdx];
            if (nIdx == (MAX_COUNT - 1))
                nCount += nCount30Above;

            strHtml += "<td>" + nCount.toString() + "</td>";

            var strPercent = "0";
            if (nTotal > 0)
                strPercent = (anCount[nIdx] * 50 / nTotal).toFixed(1).toString();

            strHtml += "<td class='tdSFPercent'>" + strPercent + "%</td>";

            strHtml += "<td>" + anCountAbove[nIdx].toString() + "</td>";

            strPercent = "0";
            if (nTotal > 0)
                strPercent = (anCountAbove[nIdx] * 50 / nTotal).toFixed(1).toString();

            strHtml += "<td class='tdSFPercent'>" + strPercent + "%</td>";
        }
        strHtml += "</tr></table>";

        var div = document.getElementById(strDiv);
        div.innerHTML = strHtml;
    }
}

function CStatsLongItem()
{
    this.nRoundBefore = 0; // not used currently
    this.bActive = false;
    this.nRoundAfter = 0;

    this.Reset = function()
    {
        this.nRoundBefore = 0;
        this.bActive = false;
        this.nRoundAfter = 0;
    }
}

// global variables: ----------------------------------------------------------

var g_queue = new CNumQueue();
var g_status = new CSysStatus();
var g_3C3R = new CStats3C3R();
var g_columns = new CStatsColumns();

var g_bttnColumns = new CBttnOptions("Columns", [3, 4, 5, 6, 7], null, 2, -1);
var g_bttnStatsGroups = new CBttnOptions("StatsGroups", [20, 40, 60, 80, 100, -1], null, 2, 0);

var astrValueStatsScope = [100, 200, 300, -1];
var g_bttnStatsSum = new CBttnOptions("StatsSum", astrValueStatsScope, null, 2, 150);
var g_bttnStatsScope = new CBttnOptions("StatsScope", astrValueStatsScope, null, 2, 150);
var g_bttnStatsLongsBet = new CBttnOptions("StatsLongsBet", [4, 5, 6], null, 2, 120);
var g_bttnStatsLongs = new CBttnOptions("StatsLongs", [10, 11, 12, 13], ["10+", "11+", "12+", "13+"], 2, 120);

var g_bttnStats = new CBttnOptions("Stats", [0, 1, 2, 3], ["号码", "打法", "轮次", "其它"], 0, 0);
