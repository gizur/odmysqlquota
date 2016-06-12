#
# Example of stored procedure that check the quota
#
# NOTE: Update the limit on number of tables when used!

delimiter //
create or replace procedure spCheckQuota (in queryType varchar(255),
                                          in schemaName varchar(255))
begin
  declare num_tables integer;
  declare num_tables_limit integer;

  -- always fail when testing
  set num_tables_limit = 0;

  set num_tables = (select count(*) FROM information_schema.tables WHERE table_schema = schemaName);

  if num_tables > num_tables_limit then
    select queryType in ('select','delete_table','delete','etag','service_def') as res;
  else
    select true as res;
  end if;

end //
delimiter ;

#
# Test the stored procedure. Check the output manually!
#
call spCheckQuota('select', 'mysqlacl');
call spCheckQuota('drop_table', 'mysqlacl');
call spCheckQuota('delete', 'mysqlacl');
call spCheckQuota('insert', 'mysqlacl');
