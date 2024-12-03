import { Accordion, AccordionSummary, AccordionDetails, Card, CardHeader, CardContent, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const ResponseDisplay = ({ response }) => {
  return (
    <Card>
      <CardHeader title="Response" subheader="Send your first request to start" />
      <CardContent>
        {/* Body Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Body</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              {response.body ? JSON.stringify(response.body, null, 2) : 'No Response'}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Headers Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Headers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              {response.headers ? JSON.stringify(response.headers, null, 2) : 'No Headers'}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Cookies Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Cookies</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" color="text.secondary">
              {response.cookies ? JSON.stringify(response.cookies, null, 2) : 'No Cookies'}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default ResponseDisplay
