
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

function Calc_3C3R_AddNum(num)
{
    if (num == 0) return;

    for (var n = 0; n < 6; ++n)
        g_3C3R.anValue[n]++;

    var nCol = GetNumCol(num);
    var nRow = GetNumRow(num);

    // process g_StatsInterval.anLargeCount: ----------

    var anNum3C3R = [nCol, nRow + 3];

    for (var n = 0; n < 2; ++n)
    {
        var nCount = g_3C3R.anValue[anNum3C3R[n]] - 1;
        /*
        if (nCount >= 11)
        {
            var nIdx = nCount - 11;
            if (nIdx >= 19)
                nIdx == 19;

            g_StatsInterval.anLargeCount[nIdx]++;
        }
        */
        g_3C3R.anValue[anNum3C3R[n]] = 0;
    }
}
