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
var STATS_GROUPS_COUNTS = [20, 40, 60, 80, 100, 99999];

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

function SwitchTrueFalse(strValue)
{
    var str = "F";
    if (strValue == "F")
        str = "T";

    return str;
}

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

function CBttnOptions(strName, astrTitle, anValue, nSelIdx, bFullSize)
{
    this.DATA_KEY = "BTTNS_" + strName + "_IDX";
    this.strName = strName;
    this.bFullSize = bFullSize;
    this.nCount = astrTitle.length;

    var strVal = ReadData(this.DATA_KEY, nSelIdx.toString());
    var nVal = parseInt(strVal);
    if ((nVal < 0) || (nVal >= this.nCount))
        nVal = 0;
    this.nSelIdx = nVal;

    this.astrTitle = [];
    this.anValue = [];

    for(var n = 0; n < this.nCount; ++ n)
    {
        this.astrTitle[n] = astrTitle[n];
        this.anValue[n] = anValue[n];
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

    this.GetHtml = function()
    {
        var strStyle = "";
        if (this.bFullSize)
            strStyle = "style='width: 100%' ";

        var strHtml = "<table cellpadding='0' cellspacing='10' border='0' " + strStyle + "id='tblBttn" + this.strName + "'><tr>";
        for (var n = 0; n < this.nCount; ++n)
        {
            var strClass = "tdBttn";
            if (n == this.nSelIdx)
                strClass += " tdSelBttn";

            strHtml += "<td id='tdBttn" + this.strName + n.toString() + "' ";
            strHtml += "class='" + strClass + "' ";
            strHtml += "onclick='OnBttn" + this.strName + "Click(" + n.toString() + ")'";
            strHtml += ">" + this.astrTitle[n] + "</td>";
        }

        strHtml += "</tr></table>";

        return strHtml;
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
    this.ColumnsCountBttn = 5;
    this.SGCountBttnIdx = 1; // stats group

    this.Reset = function()
    {
        this.QueueExpand = 0;
        this.KeyboardID = ReadData(DATA_KEYBOARDID, "K");
        this.Seperate3C3R = ReadData(DATA_SEPERATE3C3R, "F");

        var strVal = ReadData(DATA_COLUMNSBUTTON, "5");
        var nVal = parseInt(strVal);
        if ((nVal < 3) || (nVal > 7))
            nVal = 5;
        this.ColumnsCountBttn = nVal;

        strVal = ReadData(DATA_SGCOUNTIDX, "1");
        nVal = parseInt(strVal);
        if ((nVal < 0) || (nVal >= STATS_GROUPS_COUNTS.length))
            nVal = 1;
        this.SGCountBttnIdx = nVal;
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

    this.CalcZeroList = function()
    {
        if (this.anZero.length > 0)
            this.anZero.splice(0, this.anZero.length);

        for(var n = 0; n <= this.nIDX; ++n)
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


