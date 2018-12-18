/* z-index:
    0    - main div;
    99   - 3C3R;
    1000 - bottom div;
    1001 - show gameboard/keyboard;
    3999  - statistics;
    9999 - div import;
*/



function OnPageInit()
{
    PageInit_Data();

    Show_Keyboard(true);
    Show_3C3R();
    Show_Queue();
    Show_Columns();
    Show_FinishedLong();
    Show_RefreshColumnsButtons();
    Show_StatsGroupsCount();
    Show_RefreshStatsGroupButtons();
    Show_RefreshSysButtons();

    Show_RefreshStatsSumButton();
    Show_SumLists();

    Init_Theme();
    Show_RefreshTheme();

    if (g_nDebug == 1)
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

    g_status.Escape = 0;

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
    g_status.Escape++;
    g_status.Escape = g_status.Escape % 2;

    ChangeTheme((g_status.Escape == 0) ? ((g_status.ThemeID == 0) ? "normal" : "color") : "grey");
}

function OnSeperate3C3RClick()
{
    g_status.Seperate3C3R = SwitchTrueFalse(g_status.Seperate3C3R);
    WriteData(DATA_SEPERATE3C3R, g_status.Seperate3C3R);

    Show_3C3R();
}

function OnAddNum(num)
{
    Calc_AddNum(num);
    Calc_Sum();
    Show_AddNum();
    SaveNumbers();
}

function OnSysRestore()
{
    if (g_queue.nIDX >= 0)
        return;

    var strNum = ReadData(DATA_NUMBERS);
    ResetDataFromNumString(strNum, false);
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
    //var tdTitle = document.getElementById("tdImportTitle");
    var txt = document.getElementById("txtClipboard");
    var trSpecImport = document.getElementById("trSpecImport");
    var tdBttnDoImport = document.getElementById("tdBttnDoImport");

    //tdTitle.innerHTML = "导&nbsp;&nbsp;&nbsp;入";
    txt.value = "";
    trSpecImport.style.display = "";
    tdBttnDoImport.style.display = "";
    var div = document.getElementById("divImport");
    div.style.display = "";
    txt.select();
}

function OnStatsSumListClick(nID)
{
    var C_EXPAND_HEIGHT = 150;
    var C_COLLAPSE_HEIGHT = 48;

    var nHeight = C_EXPAND_HEIGHT;

    for (var n = 0; n < g_status.anStatsSumExpand.length; ++n)
    {
        if (n == nID)
        {
            if (g_status.anStatsSumExpand[n] == 0)
                g_status.anStatsSumExpand[n] = 1;
            else
                g_status.anStatsSumExpand[n] = 0;
        }
        else
        {
            g_status.anStatsSumExpand[n] = 0;
        }

        if (g_status.anStatsSumExpand[n] == 1)
        {
            nHeight = C_EXPAND_HEIGHT;
            //g_StatsInterval.nExpand = 0;
        }
        else
        {
            nHeight = C_COLLAPSE_HEIGHT;
        }

        var div = document.getElementById("divStatsSumListItem" + n.toString());
        div.style.height = nHeight;
    }
}


function OnImport()
{
    var txt = document.getElementById("txtClipboard");
    var strNum = txt.value;

    if (ResetDataFromNumString(strNum, true))
    {
        SaveNumbers();
        OnImportOK();
    }
}

function OnImportOK()
{
    var div = document.getElementById("divImport");
    div.style.display = "none";
}

function OnDelNum()
{
    if (g_queue.nIDX < 0)
        return;

    if (g_queue.nIDX == 0)
    {
        PageInit_Data();
        Show_AddNum();
        return;
    }

    var anNum = [];

    for(var n = 0; n < g_queue.nIDX; ++ n)
        anNum[n] = g_queue.anNum[n];

    ResetData(anNum);
    SaveNumbers();
}

function OnSysRestart()
{
    var confirmed = confirm("重置将清除当前所有数据！确定要重置吗？");
    if (confirmed == 0)
        return;

    PageInit_Data();
    Show_AddNum();
}

// ----------------------------------------------

function Show_RefreshColumnsButtons()
{
    g_bttnColumns.Show("divColumnsBttns");
}

function OnBttnColumnsClick(nIdx)
{
    g_bttnColumns.OnClick(nIdx);
    Show_Columns();
}

// ----------------------------------------------

function Show_RefreshStatsGroupButtons()
{
    g_bttnStatsGroups.Show("divStatsGroupsBttns");
}

function OnBttnStatsGroupsClick(nIdx)
{
    g_bttnStatsGroups.OnClick(nIdx);
    Show_StatsGroupsCount();
}

// ----------------------------------------------

function Show_RefreshStatsSumButton()
{
    g_bttnStatsSum.Show("divStatsSumBttns");
}

function OnBttnStatsSumClick(nIdx)
{
    g_bttnStatsSum.OnClick(nIdx);
    Show_SumLists();
}


// ----------------------------------------------

function Show_RefreshStatsScopeButton()
{
    g_bttnStatsScope.Show("divStatsScopeBttns");
}

function OnBttnStatsScopeClick(nIdx)
{
    g_bttnStatsScope.OnClick(nIdx);
    Show_StatsNumbers(-1);
    Show_StatsGames(-1);
}

// ----------------------------------------------


function Show_RefreshStatsButton()
{
    g_bttnStats.Show("divStatsBttns");
}

function OnBttnStatsClick(nIdx)
{
    g_bttnStats.OnClick(nIdx);
    SwitchStats();
}

// ----------------------------------------------

function SwitchStats()
{
    var astrDiv = ["Numbers", "Games", "Rounds"];
    var nIdx = g_bttnStats.Value();

    for (var n = 0; n < astrDiv.length; ++n)
    {
        var strDisplay = "";
        if (n != g_bttnStats.Value())
            strDisplay = "none";

        var div = document.getElementById("divStats" + astrDiv[n]);
        div.style.display = strDisplay;
    }

    var td = document.getElementById("tdStatsTitle");
    td.innerHTML = g_bttnStats.Title() + "统计数据";
}

function SwitchWindow(bStats)
{
    var strDisplayMain = bStats? "none" : "";
    var strDisplayStats = bStats? "" : "none";

    var div = document.getElementById("divMain");
    div.style.display = strDisplayMain;

    div = document.getElementById("divStats");
    div.style.display = strDisplayStats;
}

function OnShowStatistics()
{
    Show_StatsNumbers(-1);
    Show_StatsGames(-1);
    Show_StatsRoundSum();

    Show_RefreshStatsScopeButton();
    Show_RefreshStatsButton();
    SwitchStats();

    SwitchWindow(true);
}

function OnHideStatistics()
{
    SwitchWindow(false);
}

function OnStatsNumClick(nCol)
{
    Show_StatsNumbers(nCol);
}

function OnStatsGamesClick(nCol)
{
    Show_StatsGames(nCol);
}
