/* z-index:
    0  - main middle;
    5  - main top;
    9  - main bottom;
    10 - show gameboard/keyboard;
    30 - statistics middle;
    35 - statistics top;
    39 - statistics bottom;
    50 - file;
    51 - file main;
    55 - file top;
    59 - file bottom;
    90 - import;
    91 - games statistics config;
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
    Show_StatsGames(-1, true);

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

    ResetDataFromNumString(strNum, "import", AfterImportData);
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
    Show_StatsGames(-1, false);
    Show_StatsGames(-1, true);
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
    var astrDiv = ["Games", "Numbers", "Rounds", "Misc"];
    var astrTitle = ["打法统计数据", "号码统计数据", "轮次汇总数据", "其它统计数据"];
    var nIdx = g_bttnStats.Value();

    for (var n = 0; n < astrDiv.length; ++n)
    {
        var strDisplay = "";
        if (n != g_bttnStats.nSelIdx)
            strDisplay = "none";

        var div = document.getElementById("divStats" + astrDiv[n]);
        div.style.display = strDisplay;
    }

    var td = document.getElementById("tdStatsTitle");
    td.innerHTML = astrTitle[nIdx];
}

function OnHideStats()
{
    SwitchWindow("divStats", "divMain");
}

function OnStatsNumClick(nCol)
{
    Show_StatsNumbers(nCol);
}

function OnStatsGamesClick(nCol)
{
    Show_StatsGames(nCol, true);
    Show_StatsGames(-1, false);
}

function OnShowHideMoreButtons()
{
    var tr1 = document.getElementById("trBttnMore");
    var tr2 = document.getElementById("trBttnEmpty");

    var strDisplay = "";
    if (tr1.style.display == "")
        strDisplay = "none";

    tr1.style.display = strDisplay;
    tr2.style.display = strDisplay;
}

function OpenStatistics(strID)
{
    if (g_queue.nIDX < 0)
        return;

    Show_StatsGames(-1, false);
    Show_StatsNumbers(-1);
    Show_StatsRounds();
    Show_StatsMisc();

    if (strID == "g") // games
    {
        if ((g_bttnStats.nSelIdx != 0) && (g_bttnStats.nSelIdx != 1))
            g_status.StatsIdx = g_bttnStats.nSelIdx;

        g_bttnStats.nSelIdx = 0;
    }
    else if (strID == "n") // numbers
    {
        if ((g_bttnStats.nSelIdx != 0) && (g_bttnStats.nSelIdx != 1))
            g_status.StatsIdx = g_bttnStats.nSelIdx;

        g_bttnStats.nSelIdx = 1;
    }
    else if ((g_bttnStats.nSelIdx == 0) || (g_bttnStats.nSelIdx == 1))
    {
        g_bttnStats.nSelIdx = g_status.StatsIdx;
    }

    Show_RefreshStatsScopeButton();
    Show_RefreshStatsLongsButton();
    Show_RefreshStatsLongsBetButton();
    Show_RefreshStatsButton();

    SwitchStats();

    SwitchWindow("divMain", "divStats");
}

function OnMainSwitchStats(bShowGames)
{
    var strDisplay1 = "";
    var strDisplay2 = "";

    if (bShowGames)
        strDisplay2 = "none";
    else
        strDisplay1 = "none";

    var div1 = document.getElementById("divMainStatsGames");
    var div2 = document.getElementById("divMainStatsSum");

    div1.style.display = strDisplay1;
    div2.style.display = strDisplay2;
}

function OnConfigCancel()
{
    var div = document.getElementById("divConfig");
    div.style.display = "none";
}

function OnConfigOK()
{
    var selBets = $('#dgGameBets').datagrid('getChecked');
    if (selBets.length <= 0)
    {
        jAlert("至少要选择一个打法！", "打法配置");
        return;
    }

    var selRnds = $('#dgGameRnds').datagrid('getChecked');
    if (selRnds.length <= 0)
    {
        jAlert("至少要选择一个轮次！", "打法配置");
        return;
    }

    g_gamebets.betsels.rows.splice(0, g_gamebets.betsels.rows.length);
    g_gamebets.betsels.total = selBets.length;
    for (var n = 0; n < selBets.length; ++n)
        g_gamebets.betsels.rows[n] = new CValue(selBets[n].v);
    g_gamebets.SaveBetSels();

    g_gamebets.rndsels.rows.splice(0, g_gamebets.rndsels.rows.length);
    g_gamebets.rndsels.total = selRnds.length;
    for (var n = 0; n < selRnds.length; ++n)
        g_gamebets.rndsels.rows[n] = new CValue(selRnds[n].v);
    g_gamebets.SaveRndSels();

    Show_StatsGames(-1, false);
    Show_StatsGames(-1, true);

    var div = document.getElementById("divConfig");
    div.style.display = "none";
}


function OnConfigManage()
{
    $(function ()
    {
        $('#dgBetsManage').datagrid({
            data: g_gamebets.bets,
            singleSelect: false,
            showHeader: false,
            onClickRow: function (nIdxRow)
            {
                var rows = $('#dgBetsManage').datagrid('getSelections');
                var bttn = document.getElementById("tdBttnBetsManageDel");
                bttn.className = "bttnDialog " +
                    (((rows.length < 1) || (rows.length >= g_gamebets.bets.rows.length)) ?
                    "tdSBDisabled" : "tdSBEnabled");
            }
        });
    });

    var div = document.getElementById("divBetsManage");
    div.style.display = "";
}


function OnBetsManageAdd()
{
    $.messager.defaults = { ok: "确定", cancel: "取消", width: 700, top: 430 };
    $.messager.prompt('添加打法', '请输入新打法：', function (strBet)
    {
        var rb = true;
        
        if (strBet != null)
        {
            var rn = g_gamebets.AddBet(strBet);
            if (rn == -111)
            {
                jAlert('该打法已存在', '不能添加');
                rb = false;
            }
            else
            {
                rb = AfterSaveBet(rn);
            }
        }

        return rb;
    });
    $('.messager-input').attr('maxlength', 20);

    var input = $(".messager-input");
    input.select();
    input.focus();
    /*
    $('#dgBetsManage').datagrid({ data: g_gamebets.bets });
    $('#dgBetsManage').datagrid('reload');
    */
}

function OnBetsManageDel()
{
    var rows = $('#dgBetsManage').datagrid('getSelections');
    if ((rows.length < 1) || (rows.length >= g_gamebets.bets.rows.length))
        return;

    jConfirm('确定要删除当前选中的打法吗？', '请确认', function (rb)
    {
        if (rb)
        {
            var rn = g_gamebets.DeleteBets(rows);

            if (rn == 1)
            {
                $('#dgBetsManage').datagrid({ data: g_gamebets.bets });
                $('#dgBetsManage').datagrid('reload');
            }
        }
    });
}

function OnBetsManageRestoreDefault()
{
    jConfirm('确定要重新加入默认打法吗？', '请确认', function (rb)
    {
        if (rb)
        {
            var rn = g_gamebets.RestoreDefaultBets();

            if (rn == 1)
            {
                $('#dgBetsManage').datagrid({ data: g_gamebets.bets });
                $('#dgBetsManage').datagrid('reload');
            }
        }
    });
}

function OnBetsManageOK()
{
    $('#dgGameBets').datagrid({ data: g_gamebets.bets });
    $('#dgGameBets').datagrid('reload');

    var div = document.getElementById("divBetsManage");
    div.style.display = "none";
}

$(document).ready(function ()
{
    // sys change theme:
    $("#tdBttnTheme").click(function ()
    {
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
        if (g_queue.nIDX < 0)
            return;

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
        if (g_queue.nIDX >= 0)
            return;

        var strNum = ReadData(DATA_NUMBERS);
        ResetDataFromNumString(strNum, "restore", null);
    });

    // sys export:
    $("#tdBttnExport").click(function ()
    {
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
        //var tdTitle = document.getElementById("tdImportTitle");
        var txt = document.getElementById("txtClipboard");
        //var trSpecImport = document.getElementById("trSpecImport");
        //var tdBttnDoImport = document.getElementById("tdBttnDoImport");

        //tdTitle.innerHTML = "导&nbsp;&nbsp;&nbsp;入";
        txt.value = "";
        //trSpecImport.style.display = "";
        //tdBttnDoImport.style.display = "";
        var div = document.getElementById("divImport");
        div.style.display = "";
        txt.select();
    });

    // sys statistics:
    $("#tdBttnStatistics").click(function ()
    {
        OpenStatistics("s");
    });

    // stats games:
    $("#tdBttnStatsGames").click(function ()
    {
        OpenStatistics("g");
    });

    // stats numbers:
    $("#tdBttnStatsNumbers").click(function ()
    {
        OpenStatistics("n");
    });

    $("#tdBttnSave").click(function ()
    {
        if (g_queue.nIDX < 0)
            return;

        $.messager.defaults = { ok: "确定", cancel: "取消", width: 700, top: 230 };
        $.messager.prompt('保存当前数据', '请输入当前数据的名称：', function (strFileName)
        {
            var rb = true;
            if (strFileName != null)
            {
                var rn = g_files.Save(strFileName, false);
                if (rn == -111)
                {
                    jConfirm('该名称的数据已存在，是否需要覆盖？', '请确认', function (bConfirmed)
                    {
                        if (bConfirmed)
                        {
                            rn = g_files.Save(strFileName, true);
                            rb = AfterSaveFile(strFileName, rn);
                            if (rb)
                                $(".messager-body").window('close');
                        }
                    });

                    rb = false;
                }
                else
                {
                    rb = AfterSaveFile(strFileName, rn);
                }
            }

            return rb;
        });

        var strFileNameInit = new Date().format("yyyyMMdd-HHmm");
        var input = $(".messager-input");
        input.attr('maxlength', 20);
        input.val(strFileNameInit);
        input.select();
        input.focus();
    });

    $("#tdBttnManage").click(function ()
    {
        OpenFilesDialog();
    });

    $("#tdBttnConfig").click(function ()
    {
        $(function ()
        {
            $('#dgGameBets').datagrid({
                data: g_gamebets.bets,
                singleSelect: false,
                onLoadSuccess: function (data)
                {
                    if (data)
                    {
                        $.each(data.rows, function (index, item)
                        {
                            if(g_gamebets.BetSelected(item.v))
                                $('#dgGameBets').datagrid('checkRow', index);
                        });
                    }
                },
            });

            $('#dgGameRnds').datagrid({
                data: g_gamebets.rnds,
                singleSelect: false,
                onLoadSuccess: function (data)
                {
                    if (data)
                    {
                        $.each(data.rows, function (index, item)
                        {
                            if (g_gamebets.RndSelected(item.v))
                                $('#dgGameRnds').datagrid('checkRow', index);
                        });
                    }
                },
            });
        });

        var div = document.getElementById("divConfig");
        div.style.display = "";
    });

    // files operations: ------------------------------------------------------

    $("#tdBttnFileRename").click(function ()
    {
        var rows = $('#dgFiles').datagrid('getSelections');
        if (rows.length != 1)
            return;

        $.messager.defaults = { ok: "确定", cancel: "取消", width: 700, top: 230, closable: false };
        $.messager.prompt('重命名数据', '请输入该数据的新名称：', function (strFileName)
        {
            var rb = true;
            if (strFileName != null)
            {
                var strOldName = rows[0].n;

                var rn = g_files.Rename(strOldName, strFileName);

                var strMsg = "";
                var strTitle = "";
                if (rn > 0)
                {
                    strTitle = "重命名成功";
                    strMsg = "\"" + strOldName + "\"重命名为\"" + strFileName + "\"成功";

                    $('#dgFiles').datagrid({data: g_files.fs});
                    $('#dgFiles').datagrid('reload');
                }
                else
                {
                    strTitle = "重命名失败";
                    strMsg = g_files.ErrorMessage(rn);
                    rb = false;
                }

                jAlert(strMsg, strTitle);

            }
            return rb;
        });

        var input = $(".messager-input");
        input.attr('maxlength', 20);
        input.val(rows[0].n);
        input.select();
        input.focus();
    });
    
    $("#tdBttnFileDelete").click(function ()
    {
        var rows = $('#dgFiles').datagrid('getSelections');
        if (rows.length < 1)
            return;

        jConfirm('确定要删除当前选中的数据吗？', '请确认', function (rb)
        {
            if (rb)
            {
                g_files.Delete(rows);

                $('#dgFiles').datagrid({ data: g_files.fs });
                $('#dgFiles').datagrid('reload');
            }
        });
    });

    $("#tdBttnFileOpen").click(function ()
    {
        var rows = $('#dgFiles').datagrid('getSelections');
        if (rows.length != 1)
            return;

        var strNum = ReadData(rows[0].p);
        ResetDataFromNumString(strNum, "open", AfterOpenData);
    });
});
