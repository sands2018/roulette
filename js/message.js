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
    ShowHide_MoreSysButtons(false);

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

function OnSysExpand()
{
    ShowHide_MoreSysButtons(false);

    g_status.QueueExpand++;
    g_status.QueueExpand = g_status.QueueExpand % 2;

    Show_Queue();
    Show_RefreshSysButtons();
}


function OnShowKeyboardClick()
{
    ShowHide_MoreSysButtons(false);

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
    ShowHide_MoreSysButtons(false);
    Show_Keyboard(false);
}

function OnShowKeyboard()
{
    ShowHide_MoreSysButtons(false);
    Show_Keyboard(true);
}

function OnEscape()
{
    ShowHide_MoreSysButtons(false);

    g_status.Escape++;
    g_status.Escape = g_status.Escape % 2;

    ChangeTheme((g_status.Escape == 0) ? ((g_status.ThemeID == 0) ? "normal" : "color") : "grey");
}

function OnSeperate3C3RClick()
{
    ShowHide_MoreSysButtons(false);

    g_status.Seperate3C3R = SwitchTrueFalse(g_status.Seperate3C3R);
    WriteData(DATA_SEPERATE3C3R, g_status.Seperate3C3R);

    Show_3C3R();
}

function OnAddNum(num)
{
    ShowHide_MoreSysButtons(false);

    Calc_AddNum(num);
    Calc_Sum();
    Show_AddNum();
    SaveNumbers();
}

function OnStatsSumListClick(nID)
{
    var C_EXPAND_HEIGHT = 144;
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
            nHeight = C_EXPAND_HEIGHT + ((n == 3) ? 2 * (C_COLLAPSE_HEIGHT - 2) : 0);
        else
            nHeight = C_COLLAPSE_HEIGHT;

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
    ShowHide_MoreSysButtons(false);

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

function Show_RefreshStatsScopeButton()
{
    g_bttnStatsScope.Show("divStatsScopeBttns");
}

function OnBttnStatsScopeClick(nIdx)
{
    g_bttnStatsScope.OnClick(nIdx);
    Show_StatsNumbers(-1);
    Show_StatsGames(-1);
    Show_StatsRounds();
    Show_StatsMisc();
}

// ----------------------------------------------

function Show_RefreshStatsLongsBetButton()
{
    g_bttnStatsLongsBet.Show("divStatsLongsBetBttns");
}

function OnBttnStatsLongsBetClick(nIdx)
{
    g_bttnStatsLongsBet.OnClick(nIdx);
    Show_StatsLongs();
}

// ----------------------------------------------

function Show_RefreshStatsLongsButton()
{
    g_bttnStatsLongs.Show("divStatsLongsBttns");
}

function OnBttnStatsLongsClick(nIdx)
{
    g_bttnStatsLongs.OnClick(nIdx);
    Show_StatsLongs();
}

// ----------------------------------------------

function SwitchStats()
{
    var astrDiv = ["Numbers", "Games", "Rounds", "Misc"];
    var astrTitle = ["号码统计数据", "打法统计数据", "轮次汇总数据", "其它统计数据"];
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
    td.innerHTML = astrTitle[nIdx];
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


$(document).ready(function ()
{
    // sys change theme:
    $("#tdBttnTheme").click(function ()
    {
        ShowHide_MoreSysButtons(false);

        if (g_status.ThemeID > 1)
            return;

        g_status.Escape = 0;

        g_status.ThemeID++;
        g_status.ThemeID = g_status.ThemeID % 2;

        Show_RefreshTheme();
    });

    // sys restart:
    $("#tdBttnRestart").click(function ()
    {
        ShowHide_MoreSysButtons(false);

        jConfirm('重置将清除当前所有数据！确定要重置吗？', '请确认', function (rb)
        {
            if(rb)
            {
                PageInit_Data();
                Show_AddNum();
            }
        });
    });

    // sys restore:
    $("#tdBttnRestore").click(function ()
    {
        ShowHide_MoreSysButtons(false);

        if (g_queue.nIDX >= 0)
            return;

        var strNum = ReadData(DATA_NUMBERS);
        ResetDataFromNumString(strNum, false);
    });

    // sys export:
    $("#tdBttnExport").click(function ()
    {
        ShowHide_MoreSysButtons(false);

        var clipboard = new ClipboardJS('#tdBttnExport');
        var strData = NumArrayToString(g_queue);
        $("#tdBttnExport").attr("data-clipboard-action", "copy");
        $("#tdBttnExport").attr("data-clipboard-text", strData);

        clipboard.on('success', function (e)
        {
            jAlert("数据已复制到粘贴板", "导出数据");
        });

        clipboard.on('error', function (e)
        {
            jAlert("数据复制失败", "导出数据");
        });
    });

    // sys import:
    $("#tdBttnImport").click(function ()
    {
        ShowHide_MoreSysButtons(false);

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
    });

    // sys statistics:
    $("#tdBttnStatistics").click(function ()
    {
        ShowHide_MoreSysButtons(false);

        Show_StatsNumbers(-1);
        Show_StatsGames(-1);
        Show_StatsRounds();
        Show_StatsMisc();

        Show_RefreshStatsScopeButton();
        Show_RefreshStatsLongsButton();
        Show_RefreshStatsLongsBetButton();
        Show_RefreshStatsButton();
        SwitchStats();

        SwitchWindow(true);
    });

    $("#tdBttnSave").click(function ()
    {
        ShowHide_MoreSysButtons(false);
    });

    $("#tdBttnOpen").click(function ()
    {
        ShowHide_MoreSysButtons(false);
    });

    $("#tdBttnManage").click(function ()
    {
        ShowHide_MoreSysButtons(false);
    });

    $("#tdBttnMore").click(function ()
    {
        ShowHide_MoreSysButtons(true);
    });
});
