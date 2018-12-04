
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

function GetColumnSpec(nIdx)
{
    return g_anColumnsStart[nIdx].toString() + "-" + (g_anColumnsStart[nIdx] + 5).toString();
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

    this.Calc = function(queue)
    {
        var nColumnCount = this.anStart.length;

        var anCounting = [];

        for (var nn = 0; nn < nColumnCount; ++nn)
            anCounting[nn] = 1;

        this.data.Reset();

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

        this.data.Sort();
    }
}

function Calc_HighlightColumns(aPair)
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

