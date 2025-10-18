import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [balance, setBalance] = useState({
    income: 450000,
    expense: 285000,
    savings: 165000,
    savingsAccount: 520000,
  });

  const [goals, setGoals] = useState([
    { id: 1, name: 'Отпуск на море', target: 200000, current: 145000, icon: 'Palmtree' },
    { id: 2, name: 'Новый ноутбук', target: 120000, current: 85000, icon: 'Laptop' },
    { id: 3, name: 'Автомобиль', target: 800000, current: 320000, icon: 'Car' },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, type: 'income', category: 'Зарплата', amount: 150000, date: '15 октября' },
    { id: 2, type: 'expense', category: 'Продукты', amount: -12500, date: '14 октября' },
    { id: 3, type: 'expense', category: 'Транспорт', amount: -3200, date: '13 октября' },
    { id: 4, type: 'income', category: 'Фриланс', amount: 45000, date: '12 октября' },
    { id: 5, type: 'expense', category: 'Развлечения', amount: -8000, date: '11 октября' },
  ]);

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    category: '',
    amount: '',
  });
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    icon: 'Target',
  });

  const [categories] = useState([
    { name: 'Продукты', amount: 45000, color: 'bg-blue-500', percent: 32 },
    { name: 'Транспорт', amount: 18000, color: 'bg-green-500', percent: 13 },
    { name: 'Развлечения', amount: 25000, color: 'bg-purple-500', percent: 18 },
    { name: 'Здоровье', amount: 15000, color: 'bg-orange-500', percent: 11 },
    { name: 'Прочее', amount: 37000, color: 'bg-gray-500', percent: 26 },
  ]);

  const netIncome = balance.income - balance.expense;
  const savingsRate = ((balance.savings / balance.income) * 100).toFixed(1);

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    const transaction = {
      id: recentTransactions.length + 1,
      type: newTransaction.type,
      category: newTransaction.category,
      amount: newTransaction.type === 'income' ? amount : -amount,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    };

    setRecentTransactions([transaction, ...recentTransactions]);
    
    if (newTransaction.type === 'income') {
      setBalance({ ...balance, income: balance.income + amount });
    } else {
      setBalance({ ...balance, expense: balance.expense + amount });
    }

    setNewTransaction({ type: 'expense', category: '', amount: '' });
    setIsTransactionDialogOpen(false);
    toast({
      title: 'Успешно!',
      description: 'Транзакция добавлена',
    });
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    const goal = {
      id: goals.length + 1,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: 0,
      icon: newGoal.icon,
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', icon: 'Target' });
    setIsGoalDialogOpen(false);
    toast({
      title: 'Успешно!',
      description: 'Цель добавлена',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Финансовый трекер</h1>
            <p className="text-muted-foreground">Управляйте финансами умно и наглядно</p>
          </div>
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Icon name="Plus" className="h-5 w-5" />
                Добавить транзакцию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая транзакция</DialogTitle>
                <DialogDescription>Добавьте доход или расход</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Доход</SelectItem>
                      <SelectItem value="expense">Расход</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Input
                    id="category"
                    placeholder="Зарплата, Продукты, и т.д."
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddTransaction}>Добавить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-slide-up">
          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Доходы</CardTitle>
              <Icon name="TrendingUp" className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {balance.income.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Расходы</CardTitle>
              <Icon name="TrendingDown" className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {balance.expense.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-xs text-muted-foreground mt-1">За текущий месяц</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Копилка</CardTitle>
              <Icon name="PiggyBank" className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {balance.savings.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-xs text-success mt-1">Норма накоплений: {savingsRate}%</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Накопительный счёт
              </CardTitle>
              <Icon name="Wallet" className="h-5 w-5 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {balance.savingsAccount.toLocaleString('ru-RU')} ₽
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ставка 8% годовых</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" className="h-5 w-5 text-primary" />
                Финансовый обзор
              </CardTitle>
              <CardDescription>Общая картина доходов и расходов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Чистый доход</p>
                    <p className="text-2xl font-bold text-accent">
                      +{netIncome.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="CircleDollarSign" className="h-8 w-8 text-accent" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">Расходы по категориям</h4>
                    <span className="text-xs text-muted-foreground">
                      Всего: {balance.expense.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{category.percent}%</span>
                            <span className="font-semibold w-24 text-right">
                              {category.amount.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                        <Progress value={category.percent} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Target" className="h-5 w-5 text-primary" />
                    Цели
                  </CardTitle>
                  <CardDescription>Прогресс накоплений</CardDescription>
                </div>
                <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Icon name="Plus" className="h-4 w-4" />
                      Добавить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новая цель</DialogTitle>
                      <DialogDescription>Создайте финансовую цель для накоплений</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal-name">Название</Label>
                        <Input
                          id="goal-name"
                          placeholder="Отпуск, Ноутбук, и т.д."
                          value={newGoal.name}
                          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goal-target">Целевая сумма</Label>
                        <Input
                          id="goal-target"
                          type="number"
                          placeholder="0"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="goal-icon">Иконка</Label>
                        <Select
                          value={newGoal.icon}
                          onValueChange={(value) => setNewGoal({ ...newGoal, icon: value })}
                        >
                          <SelectTrigger id="goal-icon">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Target">🎯 Цель</SelectItem>
                            <SelectItem value="Palmtree">🌴 Отпуск</SelectItem>
                            <SelectItem value="Laptop">💻 Ноутбук</SelectItem>
                            <SelectItem value="Car">🚗 Автомобиль</SelectItem>
                            <SelectItem value="Home">🏠 Дом</SelectItem>
                            <SelectItem value="GraduationCap">🎓 Образование</SelectItem>
                            <SelectItem value="Heart">❤️ Здоровье</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleAddGoal}>Создать</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon name={goal.icon as any} className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{goal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {goal.current.toLocaleString('ru-RU')} / {goal.target.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-right text-muted-foreground">{progress.toFixed(0)}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Receipt" className="h-5 w-5 text-primary" />
                    Последние транзакции
                  </CardTitle>
                  <CardDescription>История операций за последние дни</CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="income">Доходы</TabsTrigger>
                  <TabsTrigger value="expense">Расходы</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="all" className="mt-0">
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-accent/10' : 'bg-destructive/10'
                          }`}
                        >
                          <Icon
                            name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'}
                            className={`h-5 w-5 ${
                              transaction.type === 'income' ? 'text-accent' : 'text-destructive'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.category}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          transaction.type === 'income' ? 'text-accent' : 'text-destructive'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="income" className="mt-0">
                <div className="space-y-3">
                  {recentTransactions
                    .filter((t) => t.type === 'income')
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <Icon name="ArrowDownLeft" className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.category}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-accent">
                          +{transaction.amount.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="expense" className="mt-0">
                <div className="space-y-3">
                  {recentTransactions
                    .filter((t) => t.type === 'expense')
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Icon name="ArrowUpRight" className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.category}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-destructive">
                          {transaction.amount.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;