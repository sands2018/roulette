var g_bDebug = true;

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


var DATA_KEYBOARDID = "KEYBOARDID";
var DATA_SEPERATE3C3R = "SEPERATE3C3R";
var DATA_COLUMNSBUTTON = "COLUMNSBUTTON";

function CSysStatus()
{
    this.ThemeID = 0;
    this.KeyboardID = "K";
    this.Seperate3C3R = "F";
    this.QueueExpand = 0;
    this.ColumnsButton = 5;

    this.Reset = function()
    {
        this.ThemeID = 0;
        this.QueueExpand = 0;
        this.KeyboardID = ReadData(DATA_KEYBOARDID, "K");
        this.Seperate3C3R = ReadData(DATA_SEPERATE3C3R, "F");

        var strVal = ReadData(DATA_COLUMNSBUTTON, "5");
        var nVal = parseInt(strVal);
        if ((nVal < 3) || (nVal > 7))
            nVal = 5;
        this.ColumnsButton = nVal;
    }
}

function CNumQueue()
{
    var MAX_NUM_COUNT = 10000;

    this.anNum = [];
    this.nIDX = -1;
    this.nCountNoZero = 0;

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
}

