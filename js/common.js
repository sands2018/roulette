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

var MAX_FILE_COUNT = 200;
var DATA_FILE_INDEX = "FILE_INDEX_DATA";
var DATA_FILE_PREFIX = "F_";

// basic: -----------------------------------------------------------

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

function DeleteData(key)
{
    if (!window.localStorage)
        return;

    var storage = window.localStorage;
    storage.removeItem(key);
}

function CReturnArray()
{
    this.anVal = [];
    this.rn = 0;
}

function NumberStringToArray(strNumbers, nMin, nMax, rtn)
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
        if (isNaN(nNum) || (nNum < nMin) || (nNum > nMax))
        {
            rtn.rn = -1;
            return;
        }

        rtn.anVal[n] = nNum;
    }

    rtn.rn = 1;
}

function CGridData()
{
    this.total = 0;
    this.rows = [];
}

function CValue(val)
{
    this.v = val;
}

function CArrayValue(val)
{
    this.v = val.slice(0);
}

function GetArrayDataString(aData)
{
    var strData = "";

    var bFirst = true;
    for (var i = 0; i < aData.length; ++i)
    {
        if (!bFirst)
            strData += ",";
        bFirst = false;

        strData += aData[i].toString();
    }

    return strData;
}

function IsIntArrayEqual(an1, an2)
{
    var nLen1 = an1.length;
    var nLen2 = an2.length;

    if (nLen1 != nLen2)
        return false;

    var bEqual = true;

    for (var n = 0; n < nLen1; ++n)
    {
        if(an1[n] != an2[n])
        {
            bEqual = false;
            break;
        }
    }

    return bEqual;
}


function CGameBets()
{
    this.bets = new CGridData();
    this.rnds = new CGridData();
    this.betsels = new CGridData();
    this.rndsels = new CGridData();

    var aBetDefault = [
        [1, 2, 4],
        [1, 2, 4, 8],
        [2, 3, 4, 6],
        [1, 2, 3, 5],
        [1, 1, 2, 3, 5],
        [1, 2, 4, 6, 9],
        [1, 1, 1, 2, 2, 3],
        [1, 2, 3, 4, 6, 9]
    ];

    this.DefaultBetSels = function ()
    {
        this.betsels.total = this.bets.total;
        for (var n = 0; n < this.bets.rows.length; ++n)
            this.betsels.rows[n] = this.bets.rows[n];
    }

    this.DefaultRndSels = function ()
    {
        for (var n = 0; n < this.rnds.rows.length; ++n)
            this.rndsels.rows[n] = this.rnds.rows[n];

        this.rndsels.total = this.rnds.total;
    }

    this.DefaultBets = function ()
    {
        for (var n = 0; n < aBetDefault.length; ++n)
            this.bets.rows[n] = new CArrayValue(aBetDefault[n]);

        this.bets.total = this.bets.rows.length;
    }

    this.DefaultRnds = function ()
    {
        for (var n = 0; n < 9; ++n)
            this.rnds.rows[n] = new CValue(n);

        this.rnds.total = this.rnds.rows.length;
    }

    this.IsDefaultBet = function(anVal)
    {
        var bFound = false;
        for(var n = 0; n < aBetDefault.length; ++ n)
        {
            if(IsIntArrayEqual(anVal, aBetDefault[n]))
            {
                bFound = true;
                break;
            }
        }
        return bFound;
    }

    var DATA_BETS = "DATA_BETS";
    var DATA_BET_SELS = "DATA_BET_SELS";
    var DATA_RND_SELS = "DATA_RND_SELS";

    this.SaveBets = function ()
    {
        var strData = JSON.stringify(this.bets);
        WriteData(DATA_BETS, strData);
    }

    this.SaveBetSels = function ()
    {
        var strData = JSON.stringify(this.betsels);
        WriteData(DATA_BET_SELS, strData);
    }

    this.SaveRndSels = function ()
    {
        var strData = JSON.stringify(this.rndsels);
        WriteData(DATA_RND_SELS, strData);
    }

    this.Load = function()
    {
        var strData = ReadData(DATA_BETS);
        if ((strData == null) || (strData.length == 0))
            this.DefaultBets();
        else
            this.bets = JSON.parse(strData);

        this.DefaultRnds();

        strData = ReadData(DATA_BET_SELS);
        if ((strData == null) || (strData.length == 0))
            this.DefaultBetSels();
        else
            this.betsels = JSON.parse(strData);

        strData = ReadData(DATA_RND_SELS);
        if ((strData == null) || (strData.length == 0))
            this.DefaultRndSels();
        else
            this.rndsels = JSON.parse(strData);
    }

    this.BetSelected = function (val)
    {
        var bChecked = false;

        for(var n = 0; n < this.betsels.rows.length; ++ n)
        {
            if (IsIntArrayEqual(this.betsels.rows[n].v, val))
            {
                bChecked = true;
                break;
            }
        }

        return bChecked;
    }

    this.RndSelected = function (nVal)
    {
        var strVal = nVal.toString();

        var bChecked = false;

        for (var n = 0; n < this.rndsels.rows.length; ++n)
        {
            if (this.rndsels.rows[n].v.toString() == strVal)
            {
                bChecked = true;
                break;
            }
        }

        return bChecked;
    }

    // return value:
    // 1: success
    // -101: bet string illegal
    // -102: too many bet rounds
    // -111: bet already exists
    // -11: too many bets
    this.AddBet = function(strBet)
    {
        if (this.bets.rows.length >= 20)
            return -11;

        var rtn = new CReturnArray();
        NumberStringToArray(strBet, 0, 999, rtn);

        if (rtn.rn != 1)
            return -101;

        if (rtn.anVal.length > 10)
            return -102;

        var bFound = false;

        for (var n = 0; n < this.bets.rows.length; ++n)
        {
            if (IsIntArrayEqual(this.bets.rows[n].v, rtn.anVal))
            {
                bFound = true;
                break;
            }
        }

        if (bFound)
            return -111;

        var val = new CArrayValue(rtn.anVal);

        this.bets.rows.push(val);
        this.betsels.rows.push(val);

        this.SaveBets();
        this.SaveBetSels();

        return 1;
    }

    // return value:
    // 1: success
    // 0: delete no bet or all bets will not be processed
    this.DeleteBets = function (rows)
    {
        if ((rows.length <= 0) || (rows.length >= this.bets.rows.length)) // actually, this should not happen
            return 0;

        for (var nn = 0; nn < rows.length; ++nn)
        {
            var strVal = GetArrayDataString(rows[nn].v);

            for (var n = this.bets.rows.length - 1; n >= 0 ; --n)
            {
                if (GetArrayDataString(this.bets.rows[n].v) == strVal)
                {
                    this.bets.rows.splice(n, 1);
                    break;
                }
            }

            for (var n = this.betsels.rows.length - 1; n >= 0 ; --n)
            {
                if (GetArrayDataString(this.betsels.rows[n].v) == strVal)
                {
                    this.betsels.rows.splice(n, 1);
                    break;
                }
            }
        }

        this.SaveBets();
        this.SaveBetSels();

        return 1;
    }

    // return value:
    // 1: success
    // 0: all default bets already exist
    this.RestoreDefaultBets = function ()
    {
        var bAllFound = true;
        for (var n0 = 0; n0 < aBetDefault.length; ++n0)
        {
            var bFound = false;

            for(var n = 0; n < this.bets.rows.length; ++ n)
            {
                if (IsIntArrayEqual(this.bets.rows[n].v, aBetDefault[n0]))
                {
                    bFound = true;
                    break;
                }
            }

            if(!bFound)
            {
                bAllFound = false;
                break;
            }
        }

        if (bAllFound)
            return 0;

        for (var n0 = 0; n0 < aBetDefault.length; ++n0)
        {
            for (var n = 0; n < this.bets.rows.length; ++n)
            {
                if (IsIntArrayEqual(this.bets.rows[n].v, aBetDefault[n0]))
                {
                    this.bets.rows.splice(n, 1);
                    break;
                }
            }

            for (var n = 0; n < this.betsels.rows.length; ++n)
            {
                if (IsIntArrayEqual(this.betsels.rows[n].v, aBetDefault[n0]))
                {
                    this.betsels.rows.splice(n, 1);
                    break;
                }
            }
        }

        for (var n0 = 0; n0 < aBetDefault.length; ++n0)
        {
            this.bets.rows.splice(n0, 0, new CArrayValue(aBetDefault[n0]));
            this.betsels.rows.splice(n0, 0, new CArrayValue(aBetDefault[n0]));
        }

        this.SaveBets();
        this.SaveBetSels();

        return 1;
    }

    this.ErrorMessage = function (rn)
    {
        var strMsg = "";
        if (rn == -101)
            strMsg = "输入的打法不合法";
        else if (rn == -102)
            strMsg = "押注不能超过10轮";
        else if (rn == -111)
            strMsg = "这个打法已经有了";
        else if (rn == -11)
            strMsg = "最多只能保存20种打法，请先删除再来添加";

        return strMsg;
    }

    this.Load();
}

var g_gamebets = new CGameBets();


// extensions: ------------------------------------------------------

String.prototype.gblen = function ()
{
    var len = 0;
    for (var i = 0; i < this.length; i++)
    {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94)
        {
            len += 2;
        } else
        {
            len++;
        }
    }
    return len;
}

Date.prototype.format = function (fmt)
{ //author: meizz   
    var o =
    {
        "M+": this.getMonth() + 1,               //月份   
        "d+": this.getDate(),                    //日   
        "H+": this.getHours(),                   //小时   
        "h+": this.getHours() % 12,              //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()              //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


// ------------------------------------------------------------------

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
        if (this.nSelIdx == nIdx)
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
    this.StatsIdx = 3;
    this.StatsDistCROpt = 0;
    this.StatsDistCR = 0;

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


function NumStringToArray(strNumbers, rtn)
{
    NumberStringToArray(strNumbers, 0, 36, rtn);
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

function CNumberMaxDistances()
{
    CIndexedArray.call(this);

    this.anMax = [];
    this.anMaxNum = [];

    this.CalcMax_Add = function (nDistance, nNum)
    {
        for(var nn = 0; nn < 10; ++ nn)
        {
            if(this.anMax[nn] < nDistance)
            {
                if (nn < 9)
                {
                    for (var n = 9; n > nn; --n)
                    {
                        this.anMax[n] = this.anMax[n - 1];
                        this.anMaxNum[n] = this.anMaxNum[n - 1];
                    }
                }

                this.anMax[nn] = nDistance;
                this.anMaxNum[nn] = nNum;

                break;
            }
        }
    }

    this.Calc = function (queue, nScope, nBefore)
    {
        for (var nn = 0; nn < 10; ++nn)
        {
            this.anMax[nn] = 0;
            this.anMaxNum[nn] = -1;
        }

        var anPrev = [];

        for (var nn = 0; nn <= 36; ++nn)
        {
            this.anValue[nn] = -1;
            this.anIdx[nn] = nn;
            anPrev[nn] = -1;
        }

        var nMaxIdx = queue.nIDX - nBefore;
        if (nMaxIdx < 0)
            return;

        var nMinIdx = nMaxIdx - nScope + 1;
        if (nMinIdx < 0)
            nMinIdx = 0;

        for (var n = nMinIdx; n <= nMaxIdx; ++n)
        {
            var nNum = queue.anNum[n];
            var nIdx = n - nMinIdx;
            var nDistance = nIdx - anPrev[nNum] - 1;
            anPrev[nNum] = nIdx;

            if (nDistance > this.anValue[nNum])
                this.anValue[nNum] = nDistance;

            this.CalcMax_Add(nDistance, nNum);
        }

        for (var nn = 0; nn <= 36; ++nn)
        {
            var nDistance = (nMaxIdx + 1) - nMinIdx - anPrev[nn] - 1;
            if (nDistance > this.anValue[nn])
                this.anValue[nn] = nDistance;

            this.CalcMax_Add(nDistance, nn);
        }

        this.Sort(false);
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


function CGameRule(nAfter, anBet)
{
    this.nAfter = nAfter;
    this.anBet = anBet;
}

// nACR: 0 - all; 1 - column; 2 - row
function CGame(gamerule, nACR)
{
    this.nAfter = gamerule.nAfter;
    this.nRound = gamerule.anBet.length;
    this.nACR = nACR;

    this.anBet = [];
    var strName = gamerule.nAfter.toString() + "_";
    for (var n = 0; n < gamerule.anBet.length; ++n)
    {
        this.anBet[n] = gamerule.anBet[n] * 10;
        strName += gamerule.anBet[n].toString();
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

    var anGameRule = [];

    for (var nn = 0; nn < g_gamebets.rndsels.rows.length; ++nn)
    {
        for (var n = 0; n < g_gamebets.betsels.rows.length; ++n)
            anGameRule.push(new CGameRule(g_gamebets.rndsels.rows[nn].v, g_gamebets.betsels.rows[n].v));
    }

    for (var nn = 0; nn < anGameRule.length; ++nn)
    {
        for (var n = 0; n < 3; ++n)
        {
            this.aGame[nn * 3 + n] = new CGame(anGameRule[nn], n);
        }
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
        if (this.nColSel == 0) // id
        {
            var anValue = [];
            for (var n = 0; n < this.aGame.length; ++n)
                anValue[n] = n;

            DoSort(anValue, this.anIdx, true);
        }
        else if (this.nColSel == 1) // win percentage
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


function CStatsWaves()
{
    this.anNum = new Array();
    this.afOffset = new Array(8);
    this.nScope = 20;

    this.anCount = new Array(8);
    this.anPrev = new Array(6);

    for (var n = 0; n < 8; ++n)
    {
        this.afOffset[n] = new Array();
        this.anCount[n] = new Array();
    }
 
    this.Reset = function (nScope)
    {
        if(nScope >= 0)
            this.nScope = nScope;

        var nLen = this.anNum.length;
        if (nLen > 0)
            this.anNum.splice(0, nLen);

        for (var n = 0; n < 8; ++n)
        {
            nLen = this.afOffset[n].length;
            if (nLen > 0)
                this.afOffset[n].splice(0, nLen);
        }

        for (var n = 0; n < 8; ++n)
        {
            nLen = this.anCount[n].length;
            if (nLen > 0)
                this.anCount[n].splice(0, nLen);
        }

        for(var n = 0; n < 6; ++ n)
            this.anPrev[n] = -1;
    }

    this.AddNum = function(num)
    {
        if (num == 0)
            return;

        this.anNum.push(num);

        var nCol = GetNumCol(num);
        var nRow = GetNumRow(num);

        var nIdx = this.anNum.length - 1;

        for (var n = 0; n < 2; ++n)
        {
            var i = ((n == 0)? nCol : (nRow + 3));
            var nn = ((i >= 3) ? (i + 1) : i);

            if(this.anPrev[i] >= 0)
            {
                var nSpan =  nIdx - this.anPrev[i];
                this.anCount[nn].push(nSpan);
                this.anCount[(i >= 3) ? 7 : 3].push(nSpan);
            }

            this.anPrev[i] = nIdx;
        }

        if (this.anNum.length < this.nScope)
            return;

        var anSum = new Array(6);
        for (var n = 0; n < 6; ++n)
            anSum[n] = 0;

        for (var n = this.anNum.length - 1; n >= this.anNum.length - this.nScope; --n)
        {
            var nNum = this.anNum[n];
            nCol = GetNumCol(nNum);
            nRow = GetNumRow(nNum);
            anSum[nCol]++;
            anSum[nRow + 3]++;
        }

        var fAv = this.nScope / 3.0;

        var fMaxOffset = 0;

        for (var n = 0; n < 6; ++n)
        {
            var nIdx = n;
            if (n >= 3)
                nIdx += 1;

            var fOffset = (anSum[n] - fAv) * 100.0 / fAv;
            this.afOffset[nIdx].push(fOffset);

            if ((n % 3) == 0)
                fMaxOffset = 0;

            var fOffsetAbs = Math.abs(fOffset);
            if (fOffsetAbs > fMaxOffset)
                fMaxOffset = fOffsetAbs;

            if ((n % 3) == 2)
                this.afOffset[nIdx + 1].push(fMaxOffset)
        }
    }

    this.ResetScope = function (nScope)
    {
        if (this.nScope == nScope)
            return;

        var anNumTemp = new Array(this.anNum.length);

        for (var n = 0; n < this.anNum.length; ++n)
            anNumTemp[n] = this.anNum[n];

        this.Reset(nScope);

        for (var n = 0; n < anNumTemp.length; ++n)
            this.AddNum(anNumTemp[n]);
    }

    // nDetail: 8、4、1
    this.DrawDistance = function (strCanvasID, nWidth, nHeight, nCR, nDetail)
    {
        var canvas = document.getElementById(strCanvasID);
        canvas.width = nWidth;
        canvas.height = nHeight;

        var nX0 = 0;
        if (nDetail != 8)
            nX0 = 60; // for numbers on the left sides

        var nRectX = (nDetail == 1) ? 30 : 10;
        var nRectY = (nDetail == 1) ? 50 : ((nDetail == 4) ? 10 : 15);
        var nRectW = nWidth - 2 * nRectX - nX0;
        var nRectH = nHeight - 2 * nRectY;

        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        var nMax = 72;
        if ((nCR % 4) == 3)
            nMax = nMax * 3;

        var nLen = this.anCount[nCR].length;
        var nIdx0 = 0;
        if (nLen > nMax)
            nIdx0 = nLen - nMax;
        
        context.strokeStyle = "#aaaaaa";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(nX0 - 1 + nRectX, nRectY);
        context.lineTo(nX0 - 1 + nRectX, nRectY + nRectH);
        context.moveTo(nX0 - 1 + nRectX + nRectW, nRectY);
        context.lineTo(nX0 - 1 + nRectX + nRectW, nRectY + nRectH);
        context.stroke();
        
        context.font = "30px 微软雅黑";

        for (var n = 0; n <= 15; ++n)
        {
            context.beginPath();

            if (nDetail != 8)
            {
                if ((n % 5) == 0)
                {
                    context.strokeStyle = "#5f5f5f";
                    context.lineWidth = ((nDetail == 4)? 2 : 3);
                }
                else
                {
                    context.strokeStyle = "#aaaaaa";
                    context.lineWidth = 1;
                }
            }
            else
            {
                context.strokeStyle = "#7f7f7f";
                context.lineWidth = 1;
            }


            if ((nDetail != 8) || ((n % 5) == 0))
            {
                context.moveTo(nX0 - 1 + nRectX, nRectY + n * nRectH / 15);
                context.lineTo(nX0 - 1 + nRectX + nRectW, nRectY + n * nRectH / 15);
                context.stroke();
            }

            if (nDetail != 8)
            {
                if ((nDetail == 1) || ((n % 5) == 0))
                {
                    var nX = nRectX;
                    nY = nRectY + 15 + n * nRectH / 15;

                    if (nDetail == 4)
                    {
                        nX += 10;

                        if (n == 0)
                            nY += 15;
                        else if (n == 15)
                            nY -= 15;
                    }

                    context.fillText((15 - n), nX, nY);
                }
            }
        }

        if ((nCR % 4) == 3)
            context.strokeStyle = "#ff9977";
        else
            context.strokeStyle = "#a9cf99";
        context.lineWidth = ((nDetail != 8) ? 5 : 5);

        context.beginPath();

        for (var n = nIdx0; n < nLen; ++n)
        {
            var nVal = this.anCount[nCR][n];
            if (nVal > 15)
                nVal = 15;

            var nX = nX0 + nRectX + (n - nIdx0) * nRectW / (nMax - 1);
            var nY = nHeight - nRectY - nVal * nRectH / 15;

            if(n == nIdx0)
                context.moveTo(nX, nY);
            else
                context.lineTo(nX, nY);
        }
        context.stroke();

        var strText = "";
        if (nCR == 0) strText = "第一组";
        else if (nCR == 1) strText = "第二组";
        else if (nCR == 2) strText = "第三组";
        else if (nCR == 3) strText = "组";
        else if (nCR == 4) strText = "第1行";
        else if (nCR == 5) strText = "第2行";
        else if (nCR == 6) strText = "第3行";
        else if (nCR == 7) strText = "行";

        var nX, nY;

        if (nDetail != 8)
        {
            nX = nX0 + nRectX + ((nDetail == 1) ? 30 : 20);
            nY = nRectY + ((nDetail == 1)? 43 : 30) + nRectH / 15;
        }
        else
        {
            nX = 30;
            nY = 70;
        }

        context.font = ((nDetail == 1) ? "40px" : "36px") + " 微软雅黑";
        context.fillText(strText, nX, nY);
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

function CRouletteFileInfo()
{
    this.n = ""; // name 
    this.p = ""; // data key value (pointer)
    this.c = 0;  // number count
    this.t = 0;  // time (in ms)
}

function CSysFiles()
{
    this.fs = new CGridData();
    this.bLoaded = false;

    this.Load = function ()
    {
        if (!this.bLoaded)
        {
            var strIndex = ReadData(DATA_FILE_INDEX, "");
            if (strIndex.length != 0)
            {
                this.fs = JSON.parse(strIndex);
            }
            this.bLoaded = true;
        }
    }

    this.ErrorMessage = function (rn)
    {
        var strMsg = "";
        if(rn == -101)
            strMsg = "名称不能为空";
        else if (rn == -102)
            strMsg = "名称不能超过24个字符（1个中文占2个字符）";
        else if (rn == -103)
            strMsg = "名称中有非法字符（名称只能包含英文字母、数字、减号、下划线、中文）";
        else if (rn == -111)
            strMsg = "该名称已经存在，请重新输入";
        else if (rn == -11)
            strMsg = "最多只能保存200条数据，请先删除再来保存";
        else if (rn == -21)
            strMsg = "新名称和原来的名称一样";
        else if (rn == -22)
            strMsg = "数据不匹配，需要重新刷新页面";

        return strMsg;
    }

    // return value:
    // 1: ok
    // -101: length is 0
    // -102: too many chars
    // -103: illegal char found
    // -111: name already exists
    this.CheckName = function (strFileName)
    {
        var strName = $.trim(strFileName);
        var nLen = strName.gblen();
        if (nLen <= 0)
            return -101;
        if (nLen > 24)
            return -102;

        var rn = 1;

        for(var n = 0; n < strName.length; ++ n)
        {
            var ch = strName[n];
            if (!(((ch >= 'A') && (ch <= 'Z')) || ((ch >= 'a') && (ch <= 'z')) || ((ch >= '0') && (ch <= '9'))
                || (ch == '-') || (ch == '_') || (strName.charCodeAt(n) > 255)))
            {
                rn = -103;
                break;
            }
        }

        var bFound = false;
        for (var n = 0; n < this.fs.rows.length; ++n)
        {
            if (this.fs.rows[n].n.toLowerCase() == strFileName.toLowerCase())
            {
                bFound = true;
                break;
            }
        }
        if (bFound)
            return -111;

        return rn;
    }

    // return value:
    // 1: success
    // -101: name length is 0
    // -102: name too many chars
    // -103: name illegal char found
    // -111: name already exists
    // -11: too many files
    this.Save = function (strFileName, bOverWrite)
    {
        var rn = this.CheckName(strFileName);
        var bDoOverWrite = (bOverWrite && (rn == -111));

        if ((rn < 0) && !bDoOverWrite)
            return rn;

        this.Load();

        if (!bDoOverWrite)
        {
            var nCount = this.fs.rows.length;
            if (nCount > MAX_FILE_COUNT)
                return -11;
        }

        var strNum = NumArrayToString(g_queue);
        var nNumCount = g_queue.nIDX + 1;
        var tm = new Date();

        if (!bDoOverWrite)
        {
            var strDataKey = DATA_FILE_PREFIX + tm.format("yyyyMMddHHmmss");
            var file = new CRouletteFileInfo();
            file.n = strFileName;
            file.p = strDataKey;
            file.c = nNumCount;
            //file.t = tm.format("yyyy-MM-dd HH:mm");
            file.t = tm.getTime();
            this.fs.rows.push(file);
            this.fs.total = this.fs.rows.length;
            var strIndex = JSON.stringify(this.fs);

            WriteData(DATA_FILE_INDEX, strIndex);
            WriteData(strDataKey, strNum);
        }
        else
        {
            var nIdx = -1;
            for (var n = 0; n < this.fs.rows.length; ++n)
            {
                if (this.fs.rows[n].n.toLowerCase() == strFileName.toLowerCase())
                {
                    nIdx = n;
                    break;
                }
            }

            if (nIdx >= 0)
            {
                this.fs.rows[nIdx].c = nNumCount;
                this.fs.rows[nIdx].t = tm.getTime();
                var strIndex = JSON.stringify(this.fs);

                WriteData(DATA_FILE_INDEX, strIndex);
                WriteData(this.fs.rows[nIdx].p, strNum);
            }
        }

        return 1;
    }

    // return value:
    // 1: success
    // -101: name length is 0
    // -102: name too many chars
    // -103: name illegal char found
    // -111: name already exists
    // -21: the same as old name
    // -22: data not match (actually, this should not happen)
    this.Rename = function (strOldName, strNewName)
    {
        if (strOldName.toLowerCase() == strNewName.toLowerCase())
            return -21;

        var strName = $.trim(strNewName);

        var rn = this.CheckName(strName);
        if (rn < 0)
            return rn;

        var bFound = false;
        for (var n = 0; n < this.fs.rows.length; ++n)
        {
            if (this.fs.rows[n].n == strOldName)
            {
                this.fs.rows[n].n = strName;
                bFound = true;
                break;
            }
        }

        if(bFound)
        {
            var strIndex = JSON.stringify(this.fs);
            WriteData(DATA_FILE_INDEX, strIndex);
        }

        return bFound ? 1 : -22;
    }

    this.Delete = function(rows)
    {
        for (var n1 = 0; n1 < rows.length; ++n1)
        {
            for (var n2 = this.fs.rows.length - 1; n2 >= 0; --n2)
            {
                if (this.fs.rows[n2].n == rows[n1].n)
                {
                    this.fs.rows.splice(n2, 1);
                    this.fs.total--;
                    DeleteData(rows[n1].p);
                }
            }
        }

        var strIndex = JSON.stringify(this.fs);
        WriteData(DATA_FILE_INDEX, strIndex);
    }
}


// global variables: ----------------------------------------------------------

var g_queue = new CNumQueue();
var g_status = new CSysStatus();
var g_3C3R = new CStats3C3R();
var g_columns = new CStatsColumns();
var g_waves = new CStatsWaves();
var g_files = new CSysFiles();

var g_bttnColumns = new CBttnOptions("Columns", [3, 4, 5, 6, 7], null, 2, -1);
var g_bttnStatsGroups = new CBttnOptions("StatsGroups", [20, 40, 60, 80, 100, -1], null, 2, 0);
var g_bttnStatsSum = new CBttnOptions("StatsSum", [100, 200, 300, -1], null, 2, 150);
var g_bttnStatsScope = new CBttnOptions("StatsScope", [18, 30, 40, 70, 110, -1], null, 2, 150);
var g_bttnStatsFrequency = new CBttnOptions("StatsFrequency", [18, 36, 54, 72, 108, 180, 360], null, 0, 0);
var g_bttnStatsLongsBet = new CBttnOptions("StatsLongsBet", [4, 5, 6], null, 2, 120);
var g_bttnStatsLongs = new CBttnOptions("StatsLongs", [10, 11, 12, 13], ["10+", "11+", "12+", "13+"], 2, 120);
var g_bttnStats = new CBttnOptions("Stats", [0, 1, 2, 3, 4, 5], ["打法", "频率", "距离", "号码", "轮次", "其它"], 0, 0);
var g_bttnViewNum = new CBttnOptions("ViewNum", [0, 1, 2, 3, 4, 5], ["一组", "二组", "三组", "1行", "2行", "3行"], 0, 0);
var g_bttnPlaySpeed = new CBttnOptions("PlaySpeed", [1, 2, 3], ["1/2", "1x", "2x"], 1, 80);
