CREATE USER 'store_manager' @'localhost' IDENTIFIED by "YoussefO123";

GRANT
SELECT,
INSERT
,
UPDATE on c49.* to 'store_manager' @'localhost';

REVOKE UPDATE on c49.* FROM 'store_manager' @'localhost';

GRANT DELETE on c49.sales to 'store_manager' @'localhost';