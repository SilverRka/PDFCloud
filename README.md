PDFCloud : 
Acts as a storage for PDF and associated thumbnail.

Create a new PDF:

curl --location --request POST 'http://localhost:3003/pdf' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name" : "Sample22.pdf",
    "pdf_url" : "https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf"
}'


Fetch List of available PDF:

curl --location --request GET 'http://localhost:3003/pdf'


Currently webHook calls an internal API to print the status


