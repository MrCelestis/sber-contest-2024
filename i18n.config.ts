export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      dateFilter: {
        month: "Month",
        year: "Year",
        custom: "Custom"
      },
      chart: {
        alt: "Failed to show chart",
        transactionLoadFailure: "Failed to load transactions",
        empty: "No transactions found for selected period"
      },
      transactions: {
        add: "Add expenses/income",
        dialog: {
            edit: "Edit",
            add: "Add"
        },
        income: "Income",
        expense: "Expense",
        category: "Category",
        amount: "Amount",
        date: "Date",
        saveFailure: "Failed to save transaction",
        deleteFailure: "Failed to delete transaction",
        sortByDate: "By Date",
        sortByAmount: "By Amount",
        categoryOther: "Other"
      }
    },
    ru: {
        dateFilter: {
          month: "Месяц",
          year: "Год",
          custom: "Другое"
        },
        chart: {
          alt: "Не удалось показать график",
          transactionLoadFailure: "Ошибка загрузки транзакций",
          empty: "Нет транзакций"
        },
        transactions: {
          add: "Добавить доходы/расходы",
          dialog: {
              edit: "Редактировать",
              add: "Добавить"
          },
          income: "Доход",
          expense: "Расход",
          category: "Категория",
          amount: "Сумма",
          date: "Дата",
          saveFailure: "Не удалось сохранить транзакцию",
          deleteFailure: "Не удалось удалить транзакцию",
          sortByDate: "По Дате",
          sortByAmount: "По Сумме",
          categoryOther: "Другое"
        }
    },
  },
}));