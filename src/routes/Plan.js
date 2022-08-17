const PlanControl = require('../controllers/PlanControl');

module.exports = (app) => {
  app.get('/plans', PlanControl.index);
  app.get('/plans/:plan_id', PlanControl.findById);

  //admin
  app.post('/admin/:user_id/plans/create', PlanControl.store);
  app.put(
    '/admin/:user_id/plans/:plan_id/update',
    PlanControl.update
  );
  app.delete(
    '/admin/:user_id/plans/:plan_id/delete',
    PlanControl.delete
  );
};
