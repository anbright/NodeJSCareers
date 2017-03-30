WITH COMP AS (
SELECT PERSON.NAME, PERSON.JOB, PERSON.SCHOOL, PERSON.COMPANY, COMPANY_INFO.INDUSTRY 
FROM PERSON 
INNER JOIN COMPANY_INFO ON PERSON.COMPANY = COMPANY_INFO.NAME
) SELECT * FROM COMP WHERE INDUSTRY LIKE '%Invest%'
