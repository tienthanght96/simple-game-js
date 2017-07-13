/**
 * Created by TANTINTANG on 7/11/2017.
 */
let budgetController = (function () {
    Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) this.percentage = Math.round((this.value / totalIncome) * 100);
        else  this.percentage = -1;
    };

    Expense.prototype.getPercentage = function () {

        return this.percentage;
    };

    Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [], inc: []
        },
        totals: {exp: 0, inc: 0},
        percentage: -1,
        budget: 0
    };

    let calculateTotal = function (type) {
        let sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    return {

        addItem: function (type, des, val) {

            let newItem, ID;
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else  ID = 0;

            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {

            let listID, indexOfElement;
            listID = data.allItems[type].map(function (current) {
                return current.id;
            });

            indexOfElement = listID.indexOf(id);
            if (indexOfElement !== -1)
                data.allItems[type].splice(indexOfElement, 1);

        },

        calculateBudget: function () {

            calculateTotal('inc');
            calculateTotal('exp');


            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else  data.percentage = -1;
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            let allPerc = data.allItems.exp.map(function (current) {
                return current.percentage;
            });

            return allPerc;

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }

    };


})();

let UIController = (function () {

    let DOMStrings = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        inputBtn: '.btn-add',
        incomeContainer: '.income-list',
        expensesContainer: '.expense-list',
        budgetLabel: '.budget-value',
        incomeLabel: '.income-value',
        expensesLabel: '.expenses-value',
        percentageLabel: '.expenses-percent',
        container: '.container',
        expensesPercLabel: '.item-percent',
        dateLabel: '.tittle-month'
    };

    let formatNumber = function (num, typ) {
        let numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (typ === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    let nodeListForEach = function (list, callbackFunction) {

        for (let i = 0; i < list.length; i++) {
            callbackFunction(list[i], i);
        }
    };

    return {

        getInput: function () {
            return {
                inputDescription: document.querySelector(DOMStrings.inputDescription).value,
                inputType: document.querySelector(DOMStrings.inputType).value,
                inputValue: document.querySelector(DOMStrings.inputValue).value
            };
        },

        addListItem: function (obj, type) {
            let html, element, newHtml;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clear-fix" id="inc-%id%"> <div class="item-description">%description%</div><div class="right clear-fix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clear-fix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clear-fix"><div class="item-value">%value%</div><div class="item-percent">21%</div><div class="item-delete"><button class="item-delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },


        deleteListItem: function (selectorID) {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            let fields, fieldArr;
            fields = document.querySelectorAll(DOMStrings.inputValue + "," + DOMStrings.inputDescription);
            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (curent) {
                curent.value = '';
            });
            fieldArr[1].focus();
        },


        displayBudget: function (obj) {

            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        },

        displayPercentages: function (percentages) {
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            });
        },


        displayMonth: function () {

            let month, list, year, now;
            now = new Date();
            list = ["Jan", 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'November', 'December'];
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = list[month] + ' ' + year;
        },


        changeType: function () {
            let fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );

            nodeListForEach(fields, function (current) {
                current.classList.toggle('.red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMstring: function () {
            return DOMStrings;
        }


    };

})();


let controller = (function (budgetCtrl, UICtrl) {
    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

    };

    let updateBudget = function () {
        budgetCtrl.calculateBudget();
        let budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function () {
        budgetCtrl.calculatePercentages();

        let percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    };

    let ctrlAddItem = function () {
        let input, newItem;
        input = UICtrl.getInput();

        if (input.inputDescription !== "" && !isNaN(input.inputValue) && input.inputValue > 0) {

            newItem = budgetCtrl.addItem(input.inputType, input.inputDescription, input.inputValue);
            UICtrl.addListItem(newItem, input.inputType);

            UICtrl.clearFields();

            updateBudget();

            updatePercentages();
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();

            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

});
controller(budgetController, UIController).init();



