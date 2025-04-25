import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem'
import factoryAbi from "../contracts/ChessTournamentFactoryAbi.json"
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material'

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

type pageProps = {
  url: string,
  fee: string,
  setFee: (arg0: string) => void
}
function CreateTournament({ url, fee, setFee }: pageProps) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  return (
    <Box sx={{ marginTop: 'auto', padding: '1rem' }}>
      {
        isPending || isConfirming ?
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
            <CircularProgress size={30} color='secondary' />
            <Typography>{isPending ? "Pending Wallet Transaction..." : isConfirming ? "Confirming Transaction..." : ""}</Typography>
          </Box>
          :
          !isConfirmed ?
            <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'row', gap: '10px' }}>
              <TextField id="outlined-basic" label="Fee (FLR)" size="small" variant="outlined" type="number" sx={{ width: '100px' }} value={fee} slotProps={{
                htmlInput: {
                  min: 0,
                },
              }} onChange={(e) => {
                setFee(e.target.value)
              }} />
              <Button variant='outlined'
                onClick={() =>
                  writeContract({
                    abi: factoryAbi,
                    address: factoryAddress as Address,
                    functionName: 'createChessTournament',
                    args: [url, parseEther(fee)]
                  })
                }
              >
                Deploy Tournament Contract
              </Button>
            </Box>
            :
            <Box>
              {!error ?
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                  <Typography sx={{ textAlign: 'center', marginBottom: '10px' }}>✅ Transaction Succesful!</Typography>
                  <Typography sx={{ color: 'blue', textAlign: 'center' }}><a href={`https://coston2-explorer.flare.network/tx/${hash}`}>View In Explorer</a></Typography>
                </Box>
                : <Typography>❌ {error.message}</Typography>}
            </Box>
      }
    </Box>
  )
}

export default CreateTournament;