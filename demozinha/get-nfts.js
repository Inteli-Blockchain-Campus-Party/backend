
const Moralis = require("moralis").default;

const { EvmChain } = require("@moralisweb3/evm-utils");

exports.getNFTs = async (desiredAddress) => {
    await Moralis.start({
        apiKey: "cFctUfw159kLcGLnIB9AR3OmrjgrPqawIBa7tWSJIEr4OWCVoThWNTRPI4jQEccT",
        // ...and any other configuration
    });

    const address = desiredAddress;

    const chain = EvmChain.GOERLI;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
    });
    return response.data.result
}