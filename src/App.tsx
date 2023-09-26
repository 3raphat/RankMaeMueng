import { useState } from "react"
import {
  Input,
  Button,
  Select,
  SelectItem,
  Selection,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react"
import axois from "axios"
import { toast } from "sonner"
import { formatSeason } from "./lib/formatSeason"
import { separateId } from "./lib/separateId"
import valorantLogo from "./assets/valorant.svg"

interface MMRData {
  current_data: {
    currenttierpatched: string
    images: {
      large: string
    }
    mmr_change_to_last_game: number
    ranking_in_tier: number
  }
  highest_rank: {
    patched_tier: string
    season: string
  }
}

function App() {
  // https://api.henrikdev.xyz/valorant/v2/mmr/[region]/[name]/[tag]

  const regions = [
    { label: "North America", value: "na" },
    { label: "Europe", value: "eu" },
    { label: "Latin America", value: "latam" },
    { label: "Brazil", value: "br" },
    { label: "Asia/Pacific", value: "ap" },
    { label: "Korea", value: "kr" },
  ]

  const [region, setRegion] = useState<Selection>(new Set(["ap"]))
  const [id, setId] = useState("")

  const [isLoading, setIsLoading] = useState(false)

  const [rankData, setRankData] = useState<MMRData>()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  function handleSubmit() {
    setIsLoading(true)

    const { name, tag } = separateId(id)

    toast.promise(
      axois
        .get<{
          data: MMRData
        }>(
          `https://api.henrikdev.xyz/valorant/v2/mmr/${
            Array.from(region)[0]
          }/${name}/${tag}`
        )
        .then((res) => {
          setRankData(res.data.data)
          onOpen()
        })
        .finally(() => {
          setIsLoading(false)
        }),
      {
        loading: "Loading...",
        success: "Success!",
        error: "Something is wrong, please try again",
      }
    )
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col space-y-4">
      <img src={valorantLogo} alt="valorant" className="w-[180px] mx-auto" />
      <h1 className="text-5xl text-center font-bold">
        ฝั่งตรงข้าม แรงค์ไรวะ <br />
        <span className="text-2xl">
          <span className="underline underline-offset-4">ตอบ:</span> แรงค์แม่มึง
        </span>
      </h1>
      <p className="text-center">
        ค้นหาแรงค์ของเกม Valorant โดยใส่ Name และ Tag และเลือก Region
      </p>
      <form className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select
          label="Region"
          className="sm:max-w-xs w-full"
          disallowEmptySelection
          selectedKeys={region}
          onSelectionChange={setRegion}
        >
          {regions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </Select>
        <Input
          type="text"
          label="Name with tag"
          placeholder="I miss her#smurf"
          isClearable
          value={id}
          onValueChange={setId}
        />
      </form>
      <Button
        fullWidth
        size="lg"
        type="submit"
        onPress={handleSubmit}
        isDisabled={!separateId(id).name || !separateId(id).tag}
        isLoading={isLoading}
        spinner={
          <svg
            className="animate-spin h-5 w-5 text-current"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        }
      >
        {isLoading ? "หาอยู่" : "ค้นหา"}
      </Button>

      {rankData && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  แต่น แตน แต๊น
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={rankData.current_data.images.large}
                        alt="rank"
                        className="w-[100px] mx-auto"
                      />
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold">
                          ปัจจุบันแรงค์{" "}
                          <span className="underline underline-offset-4">
                            {rankData.current_data.currenttierpatched}
                          </span>{" "}
                          จ้าาา...
                          <br />
                          มี {rankData.current_data.ranking_in_tier} แต้ม
                        </h2>
                        <p>
                          เกมล่าสุด{" "}
                          {rankData.current_data.mmr_change_to_last_game > 0
                            ? "+"
                            : ""}
                          {rankData.current_data.mmr_change_to_last_game} แต้ม
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-bold">
                        แรงค์สูงสุด เคยอยู่ {rankData.highest_rank.patched_tier}
                      </h2>
                      <p>
                        ในซีซั่น {formatSeason(rankData.highest_rank.season)}
                      </p>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    เออ รู้แล้ว
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}

export default App
