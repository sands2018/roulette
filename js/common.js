function CIndexedArray()
{
    this.anValue = [];
    this.anIdx = [];

    this.Sort = function (bAsend)
    {
        var nCount = anValue.length;

        var bChanged = false;
        do
        {
            bChanged = false;

            for (var n = 0; n < nCount - 1; ++n)
            {
                if ((bAsend && (anValue[anIndex[n]] > anValue[anIndex[n + 1]]))
                    || (!bAsend && (anValue[anIndex[n]] < anValue[anIndex[n + 1]])))
                {
                    tmp = anIndex[n];
                    anIndex[n] = anIndex[n + 1];
                    anIndex[n + 1] = tmp;

                    bChanged = true;
                }
            }
        } while (bChanged);
    }

    this.IndexedValue = function (idx)
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


function CSysStatus()
{
    this.KeyboardID = "K";
    this.QueueExpand = 0;

    this.Reset = functiion()
    {
        this.QueueExpand = 0;
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


