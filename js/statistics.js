﻿
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


function CStats3C3R()
{
    this.data = new CIndexedArray();

    this.Reset = function ()
    {
        this.data.Reset(6);
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
            /*
            if (nCount >= 11)
            {
                var nIdx = nCount - 11;
                if (nIdx >= 19)
                    nIdx == 19;
    
                g_StatsInterval.anLargeCount[nIdx]++;
            }
            */
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
                        this.data.anValue[nn] ++;
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

