var g_nDebug = 1;

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
        var nCount = this.anValue.length;

        var bChanged = false;
        do
        {
            bChanged = false;

            for (var n = 0; n < nCount - 1; ++n)
            {
                if ((bAsend && (this.anValue[this.anIdx[n]] > this.anValue[this.anIdx[n + 1]]))
                    || (!bAsend && (this.anValue[this.anIdx[n]] < this.anValue[this.anIdx[n + 1]])))
                {
                    tmp = this.anIdx[n];
                    this.anIdx[n] = this.anIdx[n + 1];
                    this.anIdx[n + 1] = tmp;

                    bChanged = true;
                }
            }
        } while (bChanged);
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

    this.Reset = function()
    {
        this.QueueExpand = 0;
        this.KeyboardID = ReadData(DATA_KEYBOARDID, "K");
        this.Seperate3C3R = ReadData(DATA_SEPERATE3C3R, "F");
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

        if (nNum != 0)
            this.nCountNoZero++;
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

function CStatsNumbers(nCol)
{
    var DATA_STATSNUM_COL = "STATSNUM_COL";

    var nColRead = 0;
    var strVal = ReadData(DATA_STATSNUM_COL, "");

    this.nColSel = nCol;
    this.anSort = [];

    var bValid = false;

    if (strVal.length >= 5)
    {
        var astrVal = strVal.split(",");
        if (astrVal.length == 3)
        {
            bValid = true;

            for (var n = 0; n < 3; ++n)
            {
                var nVal = parseInt(astrVal[n]);
                if (n == 0)
                {
                    if ((nVal >= 0) && (nVal < 3))
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
                this.anSort[this.nColSel - 1] = (this.anSort[this.nColSel - 1] + 1) % 2;
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
        this.anSort[0] = 1;
        this.anSort[1] = 1;

        if (this.nColSel >= 0)
        {
            if (this.nColSel > 0)
                this.anSort[this.nColSel - 1] = 0;

            bWrite = true;
        }
        else
        {
            this.nColSel = 1;
        }
    }

    if (bWrite)
    {
        strVal = this.nColSel.toString() + "," + this.anSort[0].toString() + "," + this.anSort[1].toString();
        WriteData(DATA_STATSNUM_COL, strVal);
    }

    this.anDistance = [];
    this.anFrequence = [];
    this.anIdx = [];

    this.Calc = function (queue, nCount, nBefore)
    {
        var strVal = ReadData(DATA_STATSNUM_COL, "2");

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
        var nMinIdx = queue.nIDX - nCount + 1;

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

        // calc Frequence: ----------------------

        nMaxIdx = queue.nIDX - nBefore;
        nMinIdx = queue.nIDX - nBefore - nCount + 1;

        if (nMinIdx < 0)
            nMinIdx = 0;

        for (var nn = nMaxIdx; nn >= nMinIdx ; --nn)
            this.anFrequence[queue.anNum[nn]]++;

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
            DoSort(this.anDistance, this.anIdx, (this.anSort[0] == 0));
        }
        else if (this.nColSel == 2)
        {
            DoSort(this.anFrequence, this.anIdx, (this.anSort[1] == 0));
        }
    }
}


// global variables: ----------------------------------------------------------

var g_queue = new CNumQueue();
var g_status = new CSysStatus();
var g_3C3R = new CStats3C3R();
var g_columns = new CStatsColumns();

